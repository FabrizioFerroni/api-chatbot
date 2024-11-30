import { applyDecorators, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

export function Google() {
  return applyDecorators(UseGuards(GoogleAuthGuard));
}
