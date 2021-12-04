import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserProfileViewDto {
    firstName: string;
    lastName: string;
    email: string;
    profile: UserProfileGetDto;
}