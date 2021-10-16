import { ProjectItemGetDto } from "./ProjectItemGetDto.dto";

export class ProjectGetDto {
    id: number;
    name: string;
    userId: string;
    dateCreated: Date;
    projectItems: ProjectItemGetDto[]
}