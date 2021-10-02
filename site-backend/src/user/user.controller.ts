import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserLoginByEmailDto } from './dto/UserLoginByEmailDto.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    get(@Req() request: Request) {
        return this.userService.get(request);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() user: User, @Req() request: Request) {
        return this.userService.create(user, request);
    }

    @Post("login")
    login(@Body() loginCred: UserLoginByEmailDto) {
        if (loginCred instanceof UserLoginByEmailDto) {
            return this.userService.loginByEmail(loginCred);
        }
    }
}
