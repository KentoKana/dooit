export class UserGetWithProfileDto {
    id: string;
    displayName: string;
    title?: string;
    bio?: string;
    dateJoined: Date;
}