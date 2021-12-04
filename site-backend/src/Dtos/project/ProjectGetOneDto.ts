import { ProjectItemGetDto } from "./ProjectItemGetDto.dto";
import { UserGetWithProfileDto } from "./UserGetWithProfileDto.dto";

export class ProjectGetOneDto {
    id: number;
    name: string;
    flairId: number;
    description: string;
    user: UserGetWithProfileDto;
    projectItems: ProjectItemGetDto[]
}