import { ProjectItemGetDto } from "./ProjectItemGetDto.dto";
import { UserGetWithProfileDto } from "./UserGetWithProfileDto.dto";

export class ProjectGetListForUserDto {
    user?: UserGetWithProfileDto;
    projects: {
        id: number;
        name: string;
        userId: string;
        flairId: number;
        description: string;
        dateCreated: Date;
        projectItems: ProjectItemGetDto[];
    }[]
}