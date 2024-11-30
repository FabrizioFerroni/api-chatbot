import { IsOptional, Max } from 'class-validator';
import { MAX_PAGE_NUMBER, MAX_PAGE_SIZE } from '../constants/querying';
import { IsCardinal } from '@/shared/decorators/validators/is-cardinal.decorator';

export class PaginationDto {
  @IsOptional()
  @Max(MAX_PAGE_NUMBER)
  @IsCardinal()
  readonly page?: number = 1;

  @IsOptional()
  @Max(MAX_PAGE_SIZE)
  @IsCardinal()
  readonly limit?: number = 10;
}
