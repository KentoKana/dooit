import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthStrategy } from './auth/auth.strategy';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, AuthStrategy, UserService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
