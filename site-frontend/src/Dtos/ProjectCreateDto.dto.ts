import { ProjectItemCreateDto } from "./ProjectItemCreateDto.dto";

export class ProjectCreateDto {
    name: string;
    projectItems: ProjectItemCreateDto[];
}