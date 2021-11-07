import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlairRepository } from 'src/repository/flairRepository.repository';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { UserRepository } from 'src/repository/UserRepository.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, UserRepository, FlairRepository])],
  exports: [TypeOrmModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule { }
