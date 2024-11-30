import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
  IsOptional,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { PasswordVerify } from '../validations/passwordverify.validation';
import { UserMessagesError } from '../errors/error-messages';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  old_password: string;

  @IsOptional()
  @ApiProperty()
  @ValidateIf((c) => c.old_password !== '')
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

  @ValidateIf((c) => c.password !== '')
  @ApiProperty()
  @PasswordVerify('password')
  confirm_password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  rol: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active: boolean;
}
