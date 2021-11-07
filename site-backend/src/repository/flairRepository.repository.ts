import { Injectable } from '@nestjs/common';
import { Flair } from 'src/models/flair.entity';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(Flair)
export class FlairRepository extends Repository<Flair>{
    async getAllFlairs() {
        const flairs = await this.createQueryBuilder("flairs").getMany();
        return flairs;
    }
}
