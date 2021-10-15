import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Get("get-all-for-user")
    @UseGuards(AuthGuard('firebase-jwt'))
    async getAllForUser(@Req() request: Request) {
        return this.projectService.getAllForUser(request.user.user_id)
    }
}