import {
  getConnection,
  SelectQueryBuilder,
  ObjectType,
  ObjectLiteral,
} from 'typeorm';

export function createQueryBuilder<T extends ObjectLiteral>(
  entity: ObjectType<T>,
  alias: string,
): SelectQueryBuilder<T> {
  return getConnection().getRepository(entity).createQueryBuilder(alias);
}
