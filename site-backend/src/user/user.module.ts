import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Profile } from 'src/models/profile.entity';
import { UserRepository } from 'src/repository/UserRepository.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, UserRepository])],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
