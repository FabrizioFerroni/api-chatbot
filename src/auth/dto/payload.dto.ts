import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthMessagesError } from '../error/error-messages';

export class PayloadDto {
  @IsEmail({}, { message: AuthMessagesError.USER_EMAIL_VALID })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  provider?: string;
}
