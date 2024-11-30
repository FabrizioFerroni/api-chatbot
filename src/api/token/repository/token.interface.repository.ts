import { Injectable } from '@nestjs/common';
import { TokenEntity } from '../entity/token.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export abstract class TokenInterfaceRepository {
  abstract findById(id: string): Promise<TokenEntity>;
  abstract findByTokenId(tokenId: string): Promise<TokenEntity>;
  abstract saveToken(token: TokenEntity): Promise<TokenEntity>;
  abstract updateToken(id: string, token: TokenEntity): Promise<UpdateResult>;
}
