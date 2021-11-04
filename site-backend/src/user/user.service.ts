import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../models/user.entity';
import { UserCreateDto } from './dto/UserCreateDto.dto'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { FirebaseError } from '@firebase/util';
import { UserGetCreatedDto } from './dto/UserGetCreatedDto.dto';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { generateFirebaseAuthErrorMessage } from 'src/helpers/firebase';
import { UserGetDto } from './dto/UserGetDto.dto';
import { UserGetLoggedIn } from './dto/UserGetLoggedInDto.dto';
import { UserEditDto } from './dto/UserEditDto.dto';
import { Profile } from 'src/models/profile.entity';
import { UserProfileViewDto } from './dto/UserProfileViewDto.dto';
import { UserRepository } from 'src/repository/UserRepository.repository';

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UserRepository, private firebaseAuth: FirebaseAuthenticationService) { }
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
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }

    async create(@Body() userDto: UserCreateDto): Promise<UserGetCreatedDto> {
        let userToCreate: User = new User();
        const { firstName, lastName, email } = userDto;
        userToCreate = {
            ...userToCreate,
            firstName,
            lastName,
            email,
            id: userDto.id,
            isActive: true
        }
        const created = await this.usersRepository.save(userToCreate);
        return {
            id: userDto.id,
            firstName: created.firstName,
            lastName: created.lastName,
            email: created.email,
        }
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
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }

    async getUserProfile(@Req() request: Request): Promise<UserProfileViewDto> {
        const user = await this.usersRepository.getUserWithProfileByUserId(request.user.user_id)
        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Found',
            }, HttpStatus.NOT_FOUND);
        }

        const { firstName, lastName, email, profile } = user;

        return {
            firstName,
            lastName,
            email,
            profile
        };
    }

    async updateUserProfile(@Body() userEditDto: UserEditDto, @Req() request: Request) {

        const userToUpdate = await this.usersRepository.getUserWithProfileByUserId(request.user.user_id);

        // Check if user to update exists
        if (!userToUpdate) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User Not Found',
            }, HttpStatus.NOT_FOUND);
        }
        const err = new HttpError();
        err.status = "server-side-error";
        err.message = "Something went wrong when attempting to update this user.";
        if (!userToUpdate) {
            throw new HttpException(err, HttpStatus.BAD_GATEWAY);
        }

        //#region Build User to Update and Save.
        // Build user to save.
        const profile = new Profile();
        profile.bio = userEditDto.profile.bio;
        profile.title = userEditDto.profile.title;
        let user = userToUpdate;
        user.firstName = userEditDto.firstName;
        user.lastName = userEditDto.lastName;
        user.email = userEditDto.email;
        user.profile = {
            ...user.profile,
            ...profile
        };
        //#endregion

        // Save User
        const savedUser = await this.usersRepository.manager.save(user)
        if (!savedUser) {
            throw new HttpException(err, HttpStatus.BAD_GATEWAY);
        }
        return {
            status: 200,
            message: "Successfully updated user!"
        }
    }
}
