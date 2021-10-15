import { Injectable } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(Project)
export class ProjectRepository extends Repository<Project>{
    async getAllProjectsForUser(userId: string) {
        const projects = await this
            .createQueryBuilder("project")
            .where("project.userId = :userId", { userId: userId })
            .leftJoinAndSelect("project.projectItems", "projectItems")
            .getMany();
        return projects;
    }

    async getProject(projectId: number) {
        const project = await this
            .createQueryBuilder("project")
            .where("project.id = :projectId", { projectId: projectId })
            .leftJoinAndSelect("project.projectItems", "projectItems")
            .getOne();
        return project;
    }
}
