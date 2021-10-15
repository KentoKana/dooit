import { Body, HttpCode, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectGetDto } from './dto/ProjectGetDto.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {
    }

    async getAllForLoggedInUser(userId: string): Promise<ProjectGetDto[]> {
        const projects = await this.projectRepository.getAllProjectsForUser(userId)
        if (!projects) {
            let err = new HttpError();
            err.status = HttpStatus.NOT_FOUND.toString();
            err.message = "Projects not found";
            throw new HttpException(err, HttpStatus.NOT_FOUND);
        }
        const dtoList: ProjectGetDto[] = projects.map((project) => {
            return {
                id: project.id,
                userId: userId,
                name: project.name,
                dateCreated: project.dateCreated,
            }
        });
        return dtoList;
    }

    async createProject(@Body() dto: ProjectCreateDto, userId: string): Promise<ProjectGetDto> {
        return;
    }
}
