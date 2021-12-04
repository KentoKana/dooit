import { ImageTagsDto } from "./ImageTagsDto.dto";

export class ProjectItemCreateDto {
    heading?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    order: number;
    imageTags?: ImageTagsDto[];
}