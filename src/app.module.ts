import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { BannerModule } from './api/banner/banner.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileModule } from './api/profile/profile.module';
import { MusicModule } from './api/music/music.module';
import { NotificationModule } from './api/notification/notification.module';
import { PostsModule } from './api/posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from 'config/database.config';
import { User } from './api/auth/entities/user.entity';
import { Profile } from './api/profile/entities/profile.entity';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([User, Profile]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'public', 'images'),
      serveRoot: '/images',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
    AuthModule, BannerModule, ProfileModule, MusicModule, NotificationModule, PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
