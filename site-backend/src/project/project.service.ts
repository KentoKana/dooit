import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { ProjectItem } from 'src/models/projectItem.entity';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { UserRepository } from 'src/repository/UserRepository.repository';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectGetDto } from './dto/ProjectGetDto.dto';
import { ProjectItemGetDto } from './dto/ProjectItemGetDto.dto';

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
            const projItemsDto: ProjectItemGetDto[] = project.projectItems.map((item) => {
                return {
                    id: item.id,
                    heading: item.heading,
                    imageUrl: item.imageUrl,
                    imageAlt: item.imageAlt,
                    description: item.description
                }
            })
            return {
                id: project.id,
                userId: userId,
                name: project.name,
                dateCreated: project.dateCreated,
                projectItems: projItemsDto
            }
        });
        return dtoList;
    }

    async createProject(@Body() dto: ProjectCreateDto, userId: string): Promise<ProjectGetDto> {
        let user = await this.userRepository.findOne(userId);
        let newProject = new Project();

        const newItems = dto.projectItems.map((item) => {
            let newItem = new ProjectItem();
            newItem.heading = item.heading;
            newItem.imageUrl = item.imageUrl;
            newItem.imageAlt = item.imageAlt;
            newItem.description = item.description;
            newItem.dateCreated = new Date()
            return newItem;
        })

        newProject.name = dto.name;
        newProject.projectItems = newItems
        newProject.user = user;

        const created = await this.projectRepository.manager.save(newProject);

        return {
            id: created.id,
            name: created.name,
            userId: created.user.id,
            dateCreated: created.dateCreated,
            projectItems: created.projectItems.map((item) => {
                return {
                    id: item.id,
                    heading: item.heading,
                    imageUrl: item.imageUrl,
                    imageAlt: item.imageAlt,
                    description: item.description
                }
            })
        }
    }
}
