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
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin'
import { ProjectModule } from './project/project.module';
import * as admin from 'firebase-admin'
import * as serviceAccountKey from "./firebase/serviceaccount.json"
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
//@ts-ignore
const serviceAccount: admin.ServiceAccount = serviceAccountKey;
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UserModule,
    ProjectModule,
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(serviceAccount)
      })
    }),
    ProjectModule,],
  controllers: [AppController, UserController, ProjectController],
  providers: [AppService, AuthStrategy, UserService, ProjectService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
