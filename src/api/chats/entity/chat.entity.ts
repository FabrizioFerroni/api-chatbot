import { UsersEntity } from '@/api/users/entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_id', nullable: false })
  chatId: string;

  @Column({ name: 'prompt', type: 'text', nullable: false })
  prompt: string;

  @Column({ name: 'response_ia', type: 'text', nullable: false })
  responseIA: string;

  @Column({ name: 'model', nullable: false })
  model: string;

  @Column({ name: 'is_new_chat', nullable: false, default: false })
  isNewChat: boolean;

  @ManyToOne(() => UsersEntity, {
    cascade: ['soft-remove'],
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @CreateDateColumn({ name: 'created_at', select: true })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date;
}
