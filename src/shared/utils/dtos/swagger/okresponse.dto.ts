import { ApiProperty } from '@nestjs/swagger';

export class OkResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: object[] | object;

  @ApiProperty()
  statusCode: number;
}
