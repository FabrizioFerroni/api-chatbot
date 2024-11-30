import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [UsersModule, TokenModule, ChatsModule],
  exports: [UsersModule, TokenModule],
})
export class ApiModule {}
