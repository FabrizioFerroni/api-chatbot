import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { BaseInterfaceRepository } from './mysql.base.interface.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface HasId {
  id: string;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public async queryBuilder(
    alias: string,
    queryRunner: QueryRunner,
  ): Promise<SelectQueryBuilder<T>> {
    return await this.entity.createQueryBuilder(alias, queryRunner);
  }

  public async query(query: string, parameters?: any[]): Promise<any> {
    return await this.entity.query(query, parameters);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findAndCount(
    options?: FindManyOptions<T>,
  ): Promise<[T[], number]> {
    return await this.entity.findAndCount(options);
  }

  public async findBorrado(options?: FindOptionsWhere<T>): Promise<T> {
    return await this.entity.findOneBy(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async softRemove(data: T): Promise<T> {
    return await this.entity.softRemove(data);
  }

  public async softDelete(data: string): Promise<UpdateResult> {
    return await this.entity.softDelete(data);
  }

  public async restore(id: string): Promise<UpdateResult> {
    return await this.entity.restore(id);
  }

  public async update(
    id: string,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.entity.update(id, data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }

  public async exists(options: FindManyOptions<T>): Promise<boolean> {
    return await this.entity.exists(options);
  }
}
