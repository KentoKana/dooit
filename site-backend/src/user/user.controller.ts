import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request, Request } from 'express';
import { UserCreateDto } from 'src/Dtos/user/UserCreateDto.dto';
import { UserEditDto } from 'src/Dtos/user/UserEditDto.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Get()
    @UseGuards(AuthGuard('firebase-jwt'))
    get(@Req() request: Request) {
        return this.userService.get(request);
    }

    @Post("check-username-availability")
    checkUsernameAvailability(@Body() username: { username: string }) {
        return this.userService.checkUsernameAvailability(username.username)
    }

    @Post("create")
    create(@Body() user: UserCreateDto) {
        return this.userService.create(user);
    }

    @Get("login")
    @UseGuards(AuthGuard('firebase-jwt'))
    login(@Req() request: Request) {
        return this.userService.loginByEmail(request);
    }

    @Get("user-profile")
    @UseGuards(AuthGuard('firebase-jwt'))
    getUserProfile(@Req() request: Request) {
        return this.userService.getUserProfile(request);
    }

    @Patch("update-user-profile")
    @UseGuards(AuthGuard('firebase-jwt'))
    updateUserProfile(@Body() userEditDto: UserEditDto, @Req() request: Request) {
        return this.userService.updateUserProfile(userEditDto, request)
    }
}
