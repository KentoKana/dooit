import { Injectable } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { EntityRepository, Repository } from 'typeorm';

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
        const project = await this
            .createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "user")
            .leftJoinAndSelect("user.profile", "profile")
            .leftJoinAndSelect("project.projectItems", "projectItems")
            .where("project.id = :projectId", { projectId: projectId })
            .getOne();
        return project;
    }
}
