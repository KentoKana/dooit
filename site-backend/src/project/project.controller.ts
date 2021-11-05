import { Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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

    @Get("get-all-for-logged-in-user")
    @UseGuards(AuthGuard('firebase-jwt'))
    async getAllForLoggedInUser(@Req() request: Request) {
        return this.projectService.getAllForLoggedInUser(request.user.user_id)
    }

    @Post("create-project")
    @UseGuards(AuthGuard('firebase-jwt'))
    @UseInterceptors(FilesInterceptor("files"))
    async createProjectForLoggedInUser(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: ProjectCreateDto, @Req() request: Request) {
        return this.projectService.createProject(body, request.user.user_id, files);
    }
}
