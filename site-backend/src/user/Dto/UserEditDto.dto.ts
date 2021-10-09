import { UserProfileGetDto } from "./UserProfileGetDto.dto";

export class UserEditDto {
    firstName: string;
    lastName: string;
    email: string;
    profile: UserProfileGetDto;
}