import { Expose } from 'class-transformer';

export class ModelsResponseDto {
  @Expose()
  owner: string;

  @Expose()
  name: string;

  @Expose()
  type: string;
}
