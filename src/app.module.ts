import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n'
import * as path from 'path'
import config from './config'
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthInterceptor } from "./common/interceptor/auth.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...config]
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123456',
      database: 'xiaozhu-admin',
      synchronize: true,
      autoLoadEntities: true
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'zh-CN',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    UserModule,
    CacheModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor
    }
  ],
})
export class AppModule {}
