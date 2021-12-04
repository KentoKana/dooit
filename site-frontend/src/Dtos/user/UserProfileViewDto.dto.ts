import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserProfileViewDto {
    displayName: string;
    email: string;
    profile: UserProfileGetDto;
}