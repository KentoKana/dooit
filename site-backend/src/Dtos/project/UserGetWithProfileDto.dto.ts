export class UserGetWithProfileDto {
    id: string;
    firstName: string;
    lastName: string;
    title?: string;
    bio?: string;
    dateJoined: Date;
}