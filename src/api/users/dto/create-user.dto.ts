import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  IsOptional,
} from 'class-validator';
import { PasswordVerify } from '../validations/passwordverify.validation';
import { UserMessagesError } from '../errors/error-messages';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  lastName: string;

  @IsEmail()
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
      message: UserMessagesError.USER_PASSWORD_NOT_STRONG,
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @PasswordVerify('password')
  confirm_password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;
}
