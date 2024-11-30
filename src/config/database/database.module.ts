import { TypeOrmModule } from '@nestjs/typeorm';
import { configApp } from '../app/config.app';
import { Logger as NestLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BDFileLogs from './logger/BDFileLog';
import { UsersEntity } from '@/api/users/entity/users.entity';
import { TokenEntity } from '@/api/token/entity/token.entity';
import { ChatEntity } from '@/api/chats/entity/chat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      load: [configApp],
    }),
    // DATABASE_TYPE
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: configApp().database.host,
        port: configApp().database.port,
        username: configApp().database.username,
        password: configApp().database.password,
        database: configApp().database.database,
        entities: [UsersEntity, TokenEntity, ChatEntity],
        synchronize:
          configApp().env === 'development'
            ? true
            : configApp().env === 'test'
              ? true
              : false,
        verboseRetryLog: true,
        logging:
          configApp().env === 'development'
            ? 'all'
            : ['error', 'warn', 'schema'],
        logger: new BDFileLogs(new NestLogger()),
      }),
    }),
  ],
})
export class DatabaseModule {}
