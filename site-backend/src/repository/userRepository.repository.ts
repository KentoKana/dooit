import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async getUserWithProfileByUserId(userId: string) {
        const user = await this
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.profile", "profile")
            .where("user.id = :id", { id: userId })
            .getOne();
        return user;
    }

    async getUserByDisplayName(displayName: string) {
        const user = await this
            .createQueryBuilder("user")
            .where("user.displayName = :displayName", { displayName: displayName })
            .getOne();
        return user;
    }
}
