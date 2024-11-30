import {
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  UpdateResult,
  SelectQueryBuilder,
  QueryRunner,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;

  findOneById(id: string): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[] | T>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  findBorrado(options?: FindOptionsWhere<T>): Promise<T>;
  remove(data: T): Promise<T>;
  softRemove(data: T): Promise<T>;
  softDelete(data: string): Promise<UpdateResult>;
  restore(id: string): Promise<UpdateResult>;
  update(id: string, data: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  query(query: string, parameters?: any[]): Promise<any>;
  queryBuilder(
    alias: string,
    queryRunner: QueryRunner,
  ): Promise<SelectQueryBuilder<T>>;
  exists(options: FindManyOptions<T>): Promise<boolean>;
}
