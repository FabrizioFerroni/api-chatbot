import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { ChatEntity } from '../entity/chat.entity';
import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

@Injectable()
export abstract class ChatInterfaceRepository extends BaseAbstractRepository<ChatEntity> {
  abstract getAllChatsForUser(userId: string): Promise<ChatEntity[]>;

  abstract getAllChatsForChatId(chatId: string): Promise<ChatEntity[]>;

  abstract saveChat(data: ChatEntity): Promise<ChatEntity>;

  abstract deleteChat(id: string): Promise<UpdateResult>;
}
