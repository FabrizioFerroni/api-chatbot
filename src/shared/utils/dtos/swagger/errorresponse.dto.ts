import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  messageException: string;

  @ApiProperty()
  message: {
    message: string | string[];
    error: string;
    statusCode: number;
  };

  @ApiProperty()
  path: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;
}
