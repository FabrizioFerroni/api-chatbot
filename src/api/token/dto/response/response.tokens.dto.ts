import { Exclude, Expose, Transform } from 'class-transformer';

export class TokenResponseDto {
  @Expose({ name: 'id' })
  @Transform((value) => value.value.toString(), { toPlainOnly: true })
  id: string;

  @Expose()
  token_id: string;

  @Expose()
  isUsed: boolean;

  @Expose()
  email: string;

  @Exclude()
  token: string;
}
