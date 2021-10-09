import { Body, HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './dto/UserCreateDto.dto'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { FirebaseError } from '@firebase/util';
import { UserGetCreatedDto } from './dto/UserGetCreatedDto.dto';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { generateFirebaseAuthErrorMessage } from 'src/helpers/firebase';
import { UserGetDto } from './dto/UserGetDto.dto';
import { UserGetLoggedIn } from './dto/UserGetLoggedInDto.dto';
import { UserEditDto } from './dto/UserEditDto.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, private firebaseAuth: FirebaseAuthenticationService) { }
    async get(@Req() request: Request): Promise<UserGetDto> {
        // return request.user
        const user = await this.usersRepository.findOne(request.user.user_id);
        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Found',
            }, HttpStatus.NOT_FOUND);
        }
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }

    async create(@Body() userDto: UserCreateDto): Promise<UserGetCreatedDto> {
        return this.firebaseAuth.createUser({ email: userDto.email, password: userDto.password })
            .then(async (userCred) => {
                const uid = userCred.uid;
                return this.firebaseAuth.createCustomToken(uid).then(async (token) => {
                    let userToCreate: User = new User();
                    const { firstName, lastName, email } = userDto;
                    userToCreate = {
                        ...userToCreate,
                        firstName,
                        lastName,
                        email,
                        id: userCred.uid,
                        isActive: true
                    }
                    const created = await this.usersRepository.save(userToCreate);
                    return {
                        id: userCred.uid,
                        firstName: created.firstName,
                        lastName: created.lastName,
                        email: created.email,
                        token: token,

                    }
                })
                    .catch((error) => {
                        this.firebaseAuth.deleteUser(userCred.uid);
                        const err = new HttpError()
                        err.status = error.code;
                        err.message = generateFirebaseAuthErrorMessage(error.code)
                        throw new HttpException(err, HttpStatus.BAD_REQUEST);
                    })
            }).then((createdUser) => {
                return createdUser;
            })
            .catch((error: FirebaseError) => {
                const err = new HttpError()
                err.status = error.code;
                err.message = generateFirebaseAuthErrorMessage(error.code)
                throw new HttpException(err, HttpStatus.BAD_REQUEST);
            })

    }

    async loginByEmail(@Req() request: Request): Promise<UserGetLoggedIn> {
        const user = await this.usersRepository.findOne(request.user.user_id);
        if (!user) {
            const err = new HttpError();
            err.status = "404";
            err.message = "Could not find user."
            throw new HttpException(err, HttpStatus.NOT_FOUND);
        }
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }


    async updateUser(@Body() userEditDto: UserEditDto, @Req() request: Request) {
        let userToUpdate = await this.usersRepository.findOne(request.user.user_id)
        // Check if user to update exists
        if (!userToUpdate) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Found',
            }, HttpStatus.NOT_FOUND);
        }
        userToUpdate = {
            ...userToUpdate,
            ...userEditDto,
            dateModified: new Date(),
        }
        // Update Firebase user instance
        this.firebaseAuth.updateUser(request.user.user_id, {
            email:
                userEditDto.email
        }).then(async () => {
            const updatedUser = await this.usersRepository.save(userToUpdate);
            if (!updatedUser) {
                const err = new HttpError();
                err.status = "server-side-error";
                err.message = "Something went wrong when attempting to update this user.";
                throw new HttpException(err, HttpStatus.BAD_GATEWAY);
            }
        }).catch((error: FirebaseError) => {
            const err = new HttpError();
            err.status = error.code;
            err.message = error.message;
            throw new HttpException(err, HttpStatus.BAD_GATEWAY);
        })
        return {
            status: 200,
            message: "Successfully updated user!"
        }
    }
}
