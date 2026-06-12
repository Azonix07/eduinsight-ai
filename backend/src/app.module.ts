import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { ExamsModule } from './modules/exams/exams.module';

import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([{
        ttl: configService.get<number>('throttle.ttl')!,
        limit: configService.get<number>('throttle.limit')!,
      }]),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    SchoolsModule,
    StudentsModule,
    TeachersModule,
    SubjectsModule,
    ExamsModule,
    AiModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    // Global JWT Auth Guard
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global Roles Guard
    { provide: APP_GUARD, useClass: RolesGuard },
    // Global Rate Limiting
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
