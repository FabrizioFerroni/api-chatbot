import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controller/chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entity/chat.entity';
import { ChatInterfaceRepository } from './repository/chat.interface.repository';
import { ChatRepository } from './repository/chat.repository';
import { UsersModule } from '../users/users.module';
import { TransformDto } from '@/shared/utils';
import { CoreModule } from '@/core/core.module';
import { ConfigModule } from '@nestjs/config';
import { configApp } from '@/config/app/config.app';
import { IaService } from './services/ia.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      load: [configApp],
    }),
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    {
      provide: ChatInterfaceRepository,
      useClass: ChatRepository,
    },
    TransformDto,
    IaService,
  ],
  exports: [ChatService],
})
export class ChatsModule {}
