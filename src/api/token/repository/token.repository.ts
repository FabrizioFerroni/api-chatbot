import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { TokenInterfaceRepository } from './token.interface.repository';
import { TokenEntity } from '../entity/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TransformDto } from '@/shared/utils';
import { TokenResponseDto } from '../dto/response/response.tokens.dto';
import { BadRequestException, Inject } from '@nestjs/common';

export class TokenRepository
  extends BaseAbstractRepository<TokenEntity>
  implements TokenInterfaceRepository
{
  constructor(
    @InjectRepository(TokenEntity)
    public repository: Repository<TokenEntity>,
    @Inject(TransformDto)
    private readonly transform: TransformDto<TokenEntity, TokenResponseDto>,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<TokenEntity> {
    return await this.findOneById(id);
  }

  async findByTokenId(tokenId: string): Promise<TokenEntity> {
    const options = {
      where: {
        tokenId: String(tokenId),
      },
    };

    const result = await this.findByCondition(options);

    return result;
  }

  async saveToken(token: TokenEntity): Promise<TokenEntity> {
    const create: TokenEntity = this.create(token);
    const tokenCreated: TokenEntity = await this.save(create);

    if (!tokenCreated) {
      throw new BadRequestException('No se pudo crear el token');
    }

    return tokenCreated;
  }

  async updateToken(id: string, data: TokenEntity): Promise<UpdateResult> {
    return await this.update(id, data);
  }
}
