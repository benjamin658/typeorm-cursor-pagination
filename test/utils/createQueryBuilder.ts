import { getConnection, SelectQueryBuilder } from 'typeorm';
import { Example } from '../entities/Example';

export function createQueryBuilder(): SelectQueryBuilder<Example> {
  return getConnection()
    .getRepository(Example)
    .createQueryBuilder('example');
}
