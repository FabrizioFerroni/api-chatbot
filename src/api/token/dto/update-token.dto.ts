import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  token_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;
}
