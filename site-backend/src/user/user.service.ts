import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './dto/UserCreateDto.dto'
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from '@firebase/auth';
import { FirebaseError } from '@firebase/util';
import { Firebase } from 'src/firebase/firebase';

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

    async create(@Body() userDto: UserCreateDto, @Req() request: Request) {
        const userToCreate: User = new User();
        userToCreate.firstName = userDto.firstName;
        userToCreate.lastName = userDto.lastName;
        userToCreate.isActive = true;
        userToCreate.email = request.user.email;
        userToCreate.id = request.user.user_id
        const created = await this.usersRepository.save(userToCreate);
        return created;
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
            throw new HttpException({
                status: error.code,
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        })
    }
}
