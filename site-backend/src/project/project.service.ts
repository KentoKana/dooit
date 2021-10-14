import { HttpCode, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { ProjectsGetDto } from './dto/ProjectsGetDto.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {
    }

    async getAllForUser(userId: string): Promise<ProjectsGetDto[]> {
        const projects = await this.projectRepository.getAllProjectsForUser(userId)
        if (!projects) {
            let err = new HttpError();
            err.status = HttpStatus.NOT_FOUND.toString();
            err.message = "Projects not found";
            throw new HttpException(err, HttpStatus.NOT_FOUND);
        }
        const dtoList: ProjectsGetDto[] = projects.map((project) => {
            return {
                id: project.id,
                userId: userId,
                name: project.name,
                dateCreated: project.dateCreated,
            }
        });
        return dtoList;
    }
}
