import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { ChatEntity } from '../entity/chat.entity';
import { ChatInterfaceRepository } from './chat.interface.repository';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

export class ChatRepository
  extends BaseAbstractRepository<ChatEntity>
  implements ChatInterfaceRepository
{
  constructor(
    @InjectRepository(ChatEntity)
    public repository: Repository<ChatEntity>,
  ) {
    super(repository);
  }
  async getAllChatsForUser(userId: string): Promise<ChatEntity[]> {
    const options: FindManyOptions<ChatEntity> = {
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
        isNewChat: true,
      },
    };

    return await this.repository.find(options);
  }

  async getAllChatsForChatId(chatId: string): Promise<ChatEntity[]> {
    const options: FindManyOptions<ChatEntity> = {
      order: {
        createdAt: 'ASC',
      },
      relations: ['user'],
      where: {
        chatId,
      },
    };

    return await this.repository.find(options);
  }

  async saveChat(data: ChatEntity): Promise<ChatEntity> {
    const create: ChatEntity = this.create(data);
    const chatSaved: ChatEntity = await this.save(create);

    if (!chatSaved)
      throw new BadRequestException('No se pudo crear el registro');

    return chatSaved;
  }

  async deleteChat(id: string): Promise<UpdateResult> {
    return await this.softDelete(id);
  }
}
