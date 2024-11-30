import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshtokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
