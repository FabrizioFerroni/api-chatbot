import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthMessagesError } from '../error/error-messages';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail({}, { message: AuthMessagesError.USER_EMAIL_VALID })
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
