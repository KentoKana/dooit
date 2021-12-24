import { Injectable } from '@nestjs/common';
import { ImageTag } from 'src/models/imageTag.entity';
import { Project } from 'src/models/project.entity';
import { ProjectItem } from 'src/models/projectItem.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(Project)
export class ProjectRepository extends Repository<Project>{
    async getAllProjectsForUserByUsername(username: string) {
        const projects = await this
            .createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "user")
            .where("user.username = :username", { username: username })
            .leftJoinAndSelect("project.projectItems", "projectItems")
            .getMany();
        return projects;
    }

    async getProjectAndUserById(projectId: number) {
        const project = await getRepository(Project)
            .findOne(projectId, { relations: ["projectItems", "user", "user.profile", "projectItems.imageTags"] });
        return project;
    }
}
