import { ProjectItemGetDto } from "./ProjectItemGetDto.dto";
import { UserGetWithProfileDto } from "./UserGetWithProfileDto.dto";

export class ProjectGetOneDto {
    id: number;
    name: string;
    flairId: string;
    description: string;
    user: UserGetWithProfileDto;
    projectItems: ProjectItemGetDto[]
}