import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { ProjectItem } from 'src/models/projectItem.entity';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { UserRepository } from 'src/repository/UserRepository.repository';
import { HttpError } from 'src/shared/dto/HttpError.dto';
import { ProjectCreateDto } from './dto/ProjectCreateDto.dto';
import { ProjectGetDto } from './dto/ProjectGetDto.dto';
import { ProjectItemGetDto } from './dto/ProjectItemGetDto.dto';
import * as admin from "firebase-admin"
import { FILE } from 'dns';

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
                    description: item.description,
                    order: item.order
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

    async createProject(@Body() dto: ProjectCreateDto, userId: string, files: Array<Express.Multer.File>): Promise<ProjectGetDto> {
        let user = await this.userRepository.findOne(userId);
        let newProject = new Project();
        let fileNames: { [order: number]: { fileName: string, mimeType: string } } = {};
        const bucket = admin.storage().bucket();
        // Upload files to firebase storage
        files.forEach((file) => {
            const generatedFileName = this.generateFileName(file, userId)
            fileNames[parseInt(file.originalname)] = {
                fileName: generatedFileName,
                mimeType: file.mimetype
            }
            bucket.upload(file.path, {
                destination: `${generatedFileName}`
            })
        })
        //@ts-ignore
        // Must parse item, as the retrieved dto content type is multipart/form-data
        const newItems = JSON.parse(dto.projectItems).map((item) => {
            const fileForProjectItem = fileNames[item.order];
            let newItem = new ProjectItem();
            newItem.heading = item.heading;
            newItem.description = item.description;
            newItem.dateCreated = new Date()
            newItem.order = item.order;
            if (fileForProjectItem) {
                const fileUrl = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(fileForProjectItem.fileName) + "?alt=media"
                newItem.imageUrl = fileUrl;
                newItem.imageAlt = item.imageAlt;
            }
            return newItem;
        })

        // Assign data to new project 
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
                    description: item.description,
                    order: item.order
                }
            })
        }
    }

    private generateFileName = (file: Express.Multer.File, userId: string) => {
        return `projects/${userId}/${Date.now() + file.originalname.toString() + "." + /[^/]*$/.exec(file.mimetype)[0]}`
    }
}
