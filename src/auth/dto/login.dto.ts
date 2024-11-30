import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AuthMessagesError } from '../error/error-messages';

export class LoginDto {
  @IsEmail({}, { message: AuthMessagesError.USER_EMAIL_VALID })
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: AuthMessagesError.USER_PASSWORD_NOT_STRONG,
    },
  )
  password: string;
}
