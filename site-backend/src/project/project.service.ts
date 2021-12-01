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
import * as fs from "fs-extra"
import { FlairRepository } from 'src/repository/flairRepository.repository';
import { ProjectCreateOptionsDto } from './dto/ProjectCreateOptionsDto.dto';
import { ProjectItemCreateDto } from './dto/ProjectItemCreateDto.dto';
import { ImageTag } from 'src/models/imageTag.entity';
import { ProjectGetListForUserDto } from './dto/ProjectGetListForUserDto.dto';
import { UserGetWithProfileDto } from './dto/UserGetWithProfileDto.dto';

@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly flairRepository: FlairRepository,
        private readonly userRepository: UserRepository
    ) {
    }
    async getProjectCreateOptions(): Promise<ProjectCreateOptionsDto> {
        const flairs = await this.flairRepository.getAllFlairs();
        const dto = new ProjectCreateOptionsDto();
        dto.flairs = flairs.map((flair) => {
            return {
                id: flair.id,
                backgroundColor: flair.backgroundColor,
                flairLabel: flair.flairLabel,
                isDarkText: flair.isDarkText
            }
        });
        return dto;
    }

    async getAllProjectsForUser(userId: string): Promise<ProjectGetListForUserDto> {
        const projects = await this.projectRepository.getAllProjectsForUser(userId)
        const currentUser = await this.userRepository.getUserWithProfileByUserId(userId);
        if (!projects) {
            let err = new HttpError();
            err.status = HttpStatus.NOT_FOUND.toString();
            err.message = "Projects not found";
            throw new HttpException(err, HttpStatus.NOT_FOUND);
        }
        const userProfile: UserGetWithProfileDto = {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            bio: currentUser.profile?.bio ?? "",
            dateJoined: currentUser.dateCreated
        }
        const projectList = projects.map((project) => {
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
                flairId: project.flairId,
                dateCreated: project.dateCreated,
                description: project.description,
                projectItems: projItemsDto,
            }
        });

        const dto: ProjectGetListForUserDto = {
            user: userProfile,
            projects: projectList
        }

        return dto;
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
        const newProjectItems = JSON.parse(dto.projectItems).map((item: ProjectItemCreateDto) => {
            const fileForProjectItem = fileNames[item.order];
            let newItem = new ProjectItem();
            newItem.heading = item.heading;
            newItem.description = item.description;
            newItem.dateCreated = new Date()
            newItem.order = item.order;
            const newImageTags = item.imageTags.map((tag) => {
                let newTag = new ImageTag();
                newTag.width = tag.width;
                newTag.title = tag.title;
                newTag.url = tag.url;
                newTag.xCoordinate = tag.xCoordinate;
                newTag.yCoordinate = tag.yCoordinate;
                newTag.dateCreated = new Date();
                return newTag;
            });
            newItem.imageTags = newImageTags;

            if (fileForProjectItem) {
                const fileUrl = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(fileForProjectItem.fileName) + "?alt=media"
                newItem.imageUrl = fileUrl;
                newItem.imageAlt = item.imageAlt;
            }
            return newItem;
        })

        // Assign data to new project 
        newProject.name = dto.name;
        newProject.description = dto.description;
        newProject.projectItems = newProjectItems;
        newProject.user = user;
        newProject.flairId = dto.flairId;

        const created = await this.projectRepository.manager.save(newProject);

        // Remove uploaded files from local upload folder.
        files.forEach((file) => {
            fs.unlink(`upload/${file.filename}`);
        })

        return {
            id: created.id,
            name: created.name,
            userId: created.user.id,
            flairId: created.flairId,
            dateCreated: created.dateCreated,
            description: created.description,
            projectItems: created.projectItems.map((item) => {
                return {
                    id: item.id,
                    heading: item.heading,
                    imageUrl: item.imageUrl,
                    imageAlt: item.imageAlt,
                    description: item.description,
                    order: item.order,
                }
            })
        }
    }

    private generateFileName = (file: Express.Multer.File, userId: string) => {
        return `projects/${userId}/${Date.now() + file.originalname.toString() + "." + /[^/]*$/.exec(file.mimetype)[0]}`
    }
}
