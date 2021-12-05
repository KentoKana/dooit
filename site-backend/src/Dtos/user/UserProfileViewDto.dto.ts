import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserProfileViewDto {
    username: string;
    email: string;
    profile: UserProfileGetDto;
}