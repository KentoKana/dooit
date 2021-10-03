import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserCreateDto } from './dto/UserCreateDto.dto';
import { UserLoginByEmailDto } from './dto/UserLoginByEmailDto.dto';
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

    @Post("create")
    create(@Body() user: UserCreateDto) {
        return this.userService.create(user);
    }

    @Post("login")
    login(@Body() loginCred: UserLoginByEmailDto) {
        if (loginCred['email']) {
            return this.userService.loginByEmail(loginCred);
        }
    }

    @Post("sign-out")
    @UseGuards(AuthGuard('jwt'))
    signOut() {
        return this.userService.signOut();
    }

    @Post("reset-password")
    resetPassword(@Body() email: { email: string }) {
        return this.userService.resetPassword(email.email);
    }
}
