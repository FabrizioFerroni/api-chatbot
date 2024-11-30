import { Exclude, Expose, Transform } from 'class-transformer';

export class ResponseUserDto {
  @Expose({ name: 'id' })
  @Transform((value) => value.value.toString(), { toPlainOnly: true })
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  phone: string;

  @Expose()
  avatar: string;

  @Expose()
  provider: string;

  @Expose()
  providerId: string;

  @Expose()
  active: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
