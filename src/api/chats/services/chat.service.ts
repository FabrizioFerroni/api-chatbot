import { configApp } from '@/config/app/config.app';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import { NewChatDto } from '../dto/newchat.dto';
import { ChatInterfaceRepository } from '../repository/chat.interface.repository';
import { TransformDto } from '@/shared/utils';
import { ChatEntity } from '../entity/chat.entity';
import { ChatResponseDto } from '../dto/response/chat.response.dto';
import { plainToInstance } from 'class-transformer';
import { UserMessagesError } from '@/api/users/errors/error-messages';
import { UserService } from '@/api/users/service/user.service';
import { IaService } from './ia.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name, {
    timestamp: true,
  });

  groq = new Groq({ apiKey: configApp().groqApiKey });

  /**
   *
   */
  constructor(
    @Inject(ChatInterfaceRepository)
    private readonly chatRepository: ChatInterfaceRepository,
    @Inject(TransformDto)
    private readonly transform: TransformDto<ChatEntity, ChatResponseDto>,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(IaService)
    private readonly iaService: IaService,
  ) {}

  transformArray(data: ChatEntity[]) {
    return this.transform.transformDtoArray(data, ChatResponseDto);
  }

  transformObject(data: ChatEntity) {
    return this.transform.transformDtoObject(data, ChatResponseDto);
  }

  async getAllChatsForChatId(chatId: string) {
    const chats = await this.chatRepository.getAllChatsForChatId(chatId);

    if (chats.length < 1) {
      throw new NotFoundException('Chat not found');
    }

    return this.transformArray(chats);
  }

  async getAllChatForUser(userId: string) {
    const chats = await this.chatRepository.getAllChatsForUser(userId);
    return this.transformArray(chats);
  }

  async createChat(dto: NewChatDto, usuario_id: string) {
    const responseChat = await this.iaService.chatCompletions(dto);

    const user = await this.userService.getUserById(usuario_id);

    if (!user) {
      throw new NotFoundException(UserMessagesError.USER_NOT_FOUND);
    }

    const newChat: Partial<ChatEntity> = {
      chatId: dto.chatId,
      prompt: dto.message,
      responseIA: responseChat,
      model: dto.model,
      isNewChat: dto.isNewChat,
      user,
    };

    const data: ChatEntity = plainToInstance(ChatEntity, newChat);

    const chatNew = await this.chatRepository.saveChat(data);

    if (!chatNew) {
      throw new InternalServerErrorException(
        'Internal server error. Contact with the administrator',
      );
    }

    this.logger.log('Saving chat');

    return this.transformObject(chatNew);
  }
}
