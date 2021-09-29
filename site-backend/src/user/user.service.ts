import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserService {
    get(@Req() request: Request): Express.User {
        return request.user
    }
}
