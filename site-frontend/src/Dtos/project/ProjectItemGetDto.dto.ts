import { ImageTagsDto } from "./ImageTagsDto.dto";

export class ProjectItemGetDto {
    id: number;
    heading?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    order: number;
    tags?: ImageTagsDto[]
}