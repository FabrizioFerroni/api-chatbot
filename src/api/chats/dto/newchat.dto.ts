import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class NewChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  model: string;

  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  isNewChat: boolean;
}
