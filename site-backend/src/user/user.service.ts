import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

    async create(@Body() userDto: User, @Req() request: Request) {
        const userToCreate: User = new User();
        userToCreate.firstName = "Hello";
        userToCreate.lastName = "World";
        userToCreate.isActive = true;
        userToCreate.id = request.user.user_id
        const created = await this.usersRepository.save(userToCreate);
        return created;
    }
}
