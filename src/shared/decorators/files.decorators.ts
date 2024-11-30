import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export function Files() {
  return applyDecorators(UseInterceptors(FilesInterceptor('files')));
}
