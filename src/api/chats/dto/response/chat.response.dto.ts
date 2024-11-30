import { UsersEntity } from '@/api/users/entity/users.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ChatResponseDto {
  @Expose({ name: 'id' })
  @Transform((value) => value.value.toString(), { toPlainOnly: true })
  id: string;

  @Expose()
  chatId: string;

  @Expose()
  prompt: string;

  @Expose()
  model: string;

  @Expose()
  language: string;

  @Expose()
  @Transform(
    ({ value }) =>
      value
        ? `${value.firstName.toString()} ${value.lastName.toString()}`
        : null,
    {
      toPlainOnly: true,
    },
  )
  user: UsersEntity;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
