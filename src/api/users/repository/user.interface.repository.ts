import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { UpdateResult } from 'typeorm';
import { UsersEntity } from '../entity/users.entity';

@Injectable()
export abstract class UserInterfaceRepository extends BaseAbstractRepository<UsersEntity> {
  abstract getAllUsers(
    skip?: number,
    take?: number,
    deletedAt?: boolean,
  ): Promise<[UsersEntity[], number]>;
  abstract getUserById(id: string, deleted?: boolean): Promise<UsersEntity>;
  abstract getUserByEmail(email: string): Promise<UsersEntity>;
  abstract saveUser(data: UsersEntity): Promise<UsersEntity>;
  abstract updateUser(id: string, data: UsersEntity): Promise<UpdateResult>;
  abstract deleteUser(id: string): Promise<UpdateResult>;
  abstract restoreUser(id: string): Promise<UpdateResult>;
  abstract obtainWithRelations(): Promise<UsersEntity[]>;
  abstract userAlreadyExists(email: string, id?: string): Promise<boolean>;
  abstract userAlreadyExistsById(
    id: string,
    deleted?: boolean,
  ): Promise<boolean>;
}
