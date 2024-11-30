import { UsersEntity } from '@/api/users/entity/users.entity';
import { BaseAbstractRepository } from '@/config/database/mysql/mysql.base.repository';
import { AuthInterfaceRepository } from './auth.interface.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthRepository
  extends BaseAbstractRepository<UsersEntity>
  implements AuthInterfaceRepository
{
  constructor(
    @InjectRepository(UsersEntity)
    public repository: Repository<UsersEntity>,
  ) {
    super(repository);
  }

  /**
   * Retrieves a user from the database based on their email address.
   *
   * @param email - The email address of the user to retrieve.
   * @returns A Promise that resolves to the user entity if found, or null if not found.
   */
  async getUserByEmail(email: string): Promise<UsersEntity> {
    const options = {
      where: {
        email: String(email),
      },
    };

    const user = await this.findByCondition(options);

    if (!user) {
      return null;
    }

    return user;
  }
}
