import { Body, HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './dto/UserCreateDto.dto'
import { browserLocalPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from '@firebase/auth';
import { FirebaseError } from '@firebase/util';
import { Firebase } from 'src/firebase/firebase';
import { UserLoginByEmailDto } from './dto/UserLoginByEmailDto.dto';
import { UserGetCreatedDto } from './dto/UserGetCreatedDto.dto';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { generateFirebaseAuthErrorMessage } from 'src/helpers/firebase';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
    async get(@Req() request: Request) {
        // return request.user
        const user = await this.usersRepository.findOne(request.user.user_id);
        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Found',
            }, HttpStatus.NOT_FOUND);
        }
        return user
    }
    readonly firebase = new Firebase()

    async create(@Body() userDto: UserCreateDto): Promise<UserGetCreatedDto> {
        return createUserWithEmailAndPassword(this.firebase.auth, userDto.email, userDto.password)
            .then((userCred) => {
                return userCred.user.getIdToken(true).then(async (token) => {
                    const userToCreate: User = new User();
                    userToCreate.firstName = userDto.firstName;
                    userToCreate.lastName = userDto.lastName;
                    userToCreate.isActive = true;
                    userToCreate.email = userDto.email;
                    userToCreate.id = userCred.user.uid;
                    const created = await this.usersRepository.save(userToCreate);
                    return {
                        firstName: created.firstName,
                        lastName: created.lastName,
                        email: created.email,
                        token: token
                    }
                }).catch((error) => {
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

    async loginByEmail(@Body() loginCred: UserLoginByEmailDto) {
        return setPersistence(this.firebase.auth, browserLocalPersistence).then(async () => {
            return signInWithEmailAndPassword(this.firebase.auth, loginCred.email, loginCred.password).then((userCred) => {
                return userCred?.user.getIdToken(true).then((token) => {
                    return {
                        token: token
                    };
                })
            })
        }).catch((error: FirebaseError) => {
            const err = new HttpError()
            err.status = error.code;
            err.message = generateFirebaseAuthErrorMessage(error.code)
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        })
    }

    async signOut() {
        return this.firebase.auth.signOut()
    }

    async resetPassword(@Body() email: string) {
        return sendPasswordResetEmail(this.firebase.auth, email)
            .then(() => {
                return {
                    status: 200,
                    message: "Success!"
                }
            }).catch((error: FirebaseError) => {
                const err = new HttpError()
                err.status = error.code;

                err.message = generateFirebaseAuthErrorMessage(error.code)
                console.log(error, err);
                throw new HttpException(err, HttpStatus.BAD_REQUEST);
                // throw new NotFoundException(err)
            })
    }
}
