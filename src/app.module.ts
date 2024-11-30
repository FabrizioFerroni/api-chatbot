import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { configApp } from './config/app/config.app';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './shared/filters/exceptions.filter';
import { ResponseInterceptor } from './shared/intenceptors/response.interceptor';
import { DatabaseModule } from './config/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/modules/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      load: [configApp],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: configApp().redis.host,
            port: configApp().redis.port,
          },
          username: configApp().redis.username,
          password: configApp().redis.password,
          ttl: configApp().redis.ttl * 1000,
        }),
      }),
    }),

    ServeStaticModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => [
        {
          rootPath: join(__dirname, '..', 'swagger-static'),
          serveRoot: configApp().env === 'development' ? '/' : '/swagger',
        },
      ],
    }),

    ThrottlerModule.forRootAsync({
      useFactory: async () => [
        {
          ttl: configApp().ttl,
          limit: configApp().limit,
        },
      ],
    }),

    CoreModule,
    DatabaseModule,
    ApiModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
