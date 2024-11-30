import { UsersEntity } from '@/api/users/entity/users.entity';
import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AuthInterfaceRepository extends BaseAbstractRepository<UsersEntity> {
  abstract getUserByEmail(email: string): Promise<UsersEntity>;
}
