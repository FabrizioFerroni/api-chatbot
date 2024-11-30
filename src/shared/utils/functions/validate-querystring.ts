import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export async function validateQuerystringDto<T>(
  dtoClass: new () => T,
  query: Record<string, any>,
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, query);

  if (typeof dtoInstance !== 'object' || dtoInstance === null) {
    throw new BadRequestException('Invalid DTO instance');
  }

  const errors: ValidationError[] = await validate(dtoInstance, {
    whitelist: true,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return dtoInstance;
}
