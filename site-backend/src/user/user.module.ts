import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from '../models/user.entity';
import { UserService } from './user.service';
import { Profile } from 'src/models/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
