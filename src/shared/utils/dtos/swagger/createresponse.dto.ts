import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  statusCode: number;
}
