import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { ProjectItem } from 'src/models/projectItem.entity';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { UserRepository } from 'src/repository/UserRepository.repository';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectGetDto } from './dto/ProjectGetDto.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository, private readonly userRepository: UserRepository) {
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
        let user = await this.userRepository.findOne(userId);
        let newProject = new Project();
        const { name, projectItems } = dto;
        const newItems = projectItems.map((item) => {
            const { heading, imageUrl, imageAlt, description } = item;
            let newItem = new ProjectItem();
            newItem.heading = heading;
            newItem.imageUrl = imageUrl;
            newItem.imageUrl = imageAlt;
            newItem.description = description;
            newItem.dateCreated = new Date()
            return newItem;
        })
        newProject.name = name;
        newProject.projectItems = newItems
        newProject.user = user;

        const created = await this.projectRepository.manager.save(newProject);
        return {
            id: created.id,
            name: created.name,
            userId: created.user.id,
            dateCreated: created.dateCreated
        }
    }
}
