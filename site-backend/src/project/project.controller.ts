import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ProjectService } from './project.service';
import * as fs from "fs";
import { ProjectCreateDto } from 'src/Dtos/project/ProjectCreateDto.dto';

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
    async getAllforUser(@Param("userId") userId) {
        return this.projectService.getAllProjectsForUserByUsername(userId)
    }

    @Get("get-project/:projectId")
    async getProjectById(@Param("projectId") projectId) {
        return this.projectService.getProjectById(projectId)
    }

    @Post("create-project")
    @UseGuards(AuthGuard('firebase-jwt'))
    @UseInterceptors(FilesInterceptor("files"))
    async createProjectForLoggedInUser(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: ProjectCreateDto, @Req() request: Request) {
        return this.projectService.createProject(body, request.user.user_id, files);
    }
}
