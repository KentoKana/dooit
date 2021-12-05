import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserEditDto {
    username: string;
    email: string;
    profile: UserProfileGetDto;
}