import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectService } from './project.service';
import * as fs from "fs";

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }
    @Get("get-project-create-options")
    @UseGuards(AuthGuard('firebase-jwt'))
    async getProjectCreateOptions(@Req() request: Request) {
        return this.projectService.getProjectCreateOptions();
    }

    @Get("get-all-for-user/:userId")
    @UseGuards(AuthGuard('firebase-jwt'))
    async getAllforUser(@Req() request: Request, @Param("userId") userId) {
        return this.projectService.getAllProjectsForUser(userId)
    }

    @Post("create-project")
    @UseGuards(AuthGuard('firebase-jwt'))
    @UseInterceptors(FilesInterceptor("files"))
    async createProjectForLoggedInUser(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: ProjectCreateDto, @Req() request: Request) {
        return this.projectService.createProject(body, request.user.user_id, files);
    }
}
