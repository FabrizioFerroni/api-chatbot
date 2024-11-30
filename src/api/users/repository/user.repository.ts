import { BadRequestException } from '@nestjs/common';
import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import {
  FindManyOptions,
  IsNull,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UsersEntity } from '../entity/users.entity';
import { UserInterfaceRepository } from './user.interface.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMessagesError } from '../errors/error-messages';

export class UserRepository
  extends BaseAbstractRepository<UsersEntity>
  implements UserInterfaceRepository
{
  constructor(
    @InjectRepository(UsersEntity)
    public repository: Repository<UsersEntity>,
  ) {
    super(repository);
  }

  async getAllUsers(
    skip?: number,
    take?: number,
    deletedAt?: boolean,
  ): Promise<[UsersEntity[], number]> {
    const options: FindManyOptions<UsersEntity> = {
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    };

    if (deletedAt) {
      options.withDeleted = true;
      options.where = { deletedAt: Not(IsNull()) };
    } else {
      options.where = { deletedAt: IsNull() };
    }

    return await this.findAndCount(options);
  }

  async getUserById(id: string, deleted?: boolean): Promise<UsersEntity> {
    const option = {
      where: {
        id: id,
      },
      withDeleted: deleted,
    };
    return await this.findByCondition(option);
  }

  async getUserByEmail(email: string): Promise<UsersEntity> {
    const option = {
      where: {
        email: email,
      },
    };
    return await this.findByCondition(option);
  }

  async saveUser(data: UsersEntity): Promise<UsersEntity> {
    const create: UsersEntity = this.create(data);
    const userSaved: UsersEntity = await this.save(create);

    if (!userSaved) throw new BadRequestException(UserMessagesError.USER_ERROR);

    return userSaved;
  }

  async updateUser(id: string, data: UsersEntity): Promise<UpdateResult> {
    return await this.update(id, data);
  }

  async deleteUser(id: string): Promise<UpdateResult> {
    return await this.softDelete(id);
  }

  async restoreUser(id: string) {
    return await this.restore(id);
  }

  async obtainWithRelations(): Promise<UsersEntity[]> {
    const options = {
      relations: {},
    };
    return await this.findWithRelations(options);
  }

  async userAlreadyExists(email: string, id?: string): Promise<boolean> {
    let result: UsersEntity;

    if (!id) {
      const options = {
        where: {
          email: String(email),
        },
      };

      result = await this.findByCondition(options);
    } else {
      const options = {
        where: {
          email: String(email),
          id: Not(id),
        },
      };

      result = await this.findByCondition(options);
    }

    return !!result;
  }

  async userAlreadyExistsById(id: string, deleted?: boolean): Promise<boolean> {
    const options = {
      where: {
        id: id,
      },
      withDeleted: deleted,
    };

    return await this.exists(options);
  }
}
