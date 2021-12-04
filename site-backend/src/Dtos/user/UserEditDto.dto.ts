import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserEditDto {
    displayName: string;
    email: string;
    profile: UserProfileGetDto;
}