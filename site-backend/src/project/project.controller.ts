import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Get("get-all-for-logged-in-user")
    @UseGuards(AuthGuard('firebase-jwt'))
    async getAllForLoggedInUser(@Req() request: Request) {
        return this.projectService.getAllForLoggedInUser(request.user.user_id)
    }

    @Post("create-project-for-logged-in-user")
    @UseGuards(AuthGuard('firebase-jwt'))
    async createProjectForLoggedInUser(@Body() body: ProjectCreateDto, @Req() request: Request) {
        return this.projectService.createProject(body, request.user.user_id);
    }
}
