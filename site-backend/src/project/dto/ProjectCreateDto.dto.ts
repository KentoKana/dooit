import { ProjectItemCreateDto } from "./ProjectItemCreateDto.dto";

export class ProjectCreateDto {
    name: string;
    flairId?: number;
    projectItems: ProjectItemCreateDto[];
    files?: (File | undefined)[]
}