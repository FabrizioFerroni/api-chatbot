import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AuthMessagesError } from '../error/error-messages';
import { UserMessagesError } from '@/api/users/errors/error-messages';
import { PasswordVerify } from '@/api/users/validations/passwordverify.validation';

export class ChangePasswordDto {
  @IsEmail({}, { message: AuthMessagesError.USER_EMAIL_VALID })
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;

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
      message: UserMessagesError.USER_PASSWORD_NOT_STRONG,
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @PasswordVerify('password')
  confirm_password: string;
}
