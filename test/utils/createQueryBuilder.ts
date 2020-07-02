import { getConnection, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/User';

export function createQueryBuilder(): SelectQueryBuilder<User> {
  return getConnection()
    .getRepository(User)
    .createQueryBuilder('user');
}
