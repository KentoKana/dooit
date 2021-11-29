import { ProjectItemGetDto } from "./ProjectItemGetDto.dto";

export class ProjectGetDto {
    id: number;
    name: string;
    userId: string;
    description: string;
    dateCreated: Date;
    projectItems: ProjectItemGetDto[]
}