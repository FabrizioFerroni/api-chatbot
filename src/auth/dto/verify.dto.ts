import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthMessagesError } from '../error/error-messages';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @IsEmail({}, { message: AuthMessagesError.USER_EMAIL_VALID })
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
