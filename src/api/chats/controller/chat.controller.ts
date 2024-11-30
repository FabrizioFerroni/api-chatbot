import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';
import { NewChatDto } from '../dto/newchat.dto';
import { Authorize } from '@/auth/decorators/authorized.decorator';
import { User } from '@/auth/decorators/user.decorator';
import { UsersEntity } from '@/api/users/entity/users.entity';
import { IaService } from '../services/ia.service';

@Controller('chats')
@ApiTags('Chats')
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly iaService: IaService,
  ) {}

  @Get('models')
  @Authorize()
  async getModels() {
    return await this.iaService.getModels();
  }

  @Get('')
  @Authorize()
  async getAllChatsForUser(@User() { id: usuario_id }: UsersEntity) {
    return await this.chatService.getAllChatForUser(usuario_id);
  }

  @Get(':chatId')
  @Authorize()
  async getAllChatsForChatId(@Param('chatId') chatId: string) {
    return await this.chatService.getAllChatsForChatId(chatId);
  }

  @Post()
  @Authorize()
  async createChat(
    @Body() dto: NewChatDto,
    @User() { id: usuario_id }: UsersEntity,
  ) {
    return await this.chatService.createChat(dto, usuario_id);
  }
}
