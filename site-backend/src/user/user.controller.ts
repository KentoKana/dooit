import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request, Request } from 'express';
import { UserCreateDto } from './dto/UserCreateDto.dto';
import { UserEditDto } from './dto/UserEditDto.dto';
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

    @Get("login")
    @UseGuards(AuthGuard('jwt'))
    login(@Req() request: Request) {
        return this.userService.loginByEmail(request);
    }

    @Get("user-profile")
    @UseGuards(AuthGuard('jwt'))
    getUserProfile(@Req() request: Request) {
        return this.userService.getUserProfile(request);
    }

    @Patch("update-user-profile")
    @UseGuards(AuthGuard('jwt'))
    updateUserProfile(@Body() userEditDto: UserEditDto, @Req() request: Request) {
        return this.userService.updateUserProfile(userEditDto, request)
    }
}
