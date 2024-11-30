import { HttpStatus } from '@nestjs/common';

export class ModelResponse<T> {
  message: string;
  data: T;
  statusCode: HttpStatus;
}
