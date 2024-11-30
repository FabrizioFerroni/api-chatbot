import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  email: string;

  @Column()
  isUsed: boolean;

  @Column({ name: 'token_id' })
  tokenId: string;
}
