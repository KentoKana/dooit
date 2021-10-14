import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from 'src/repository/projectRepository.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository])],
  exports: [TypeOrmModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule { }
