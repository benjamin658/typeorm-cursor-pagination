import { getConnection, SelectQueryBuilder, ObjectType } from 'typeorm';

export function createQueryBuilder<T>(entity: ObjectType<T>, alias: string): SelectQueryBuilder<T> {
  return getConnection()
    .getRepository(entity)
    .createQueryBuilder(alias);
}
