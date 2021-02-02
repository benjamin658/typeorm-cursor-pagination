import { expect } from 'chai';
import { createConnection, getConnection } from 'typeorm';

import { createQueryBuilder } from './utils/createQueryBuilder';
import {
  prepareData,
  prepareSnakeData,
} from './utils/prepareData';
import { User } from './entities/User';
import { Photo } from './entities/Photo';
import { Snake } from './entities/Snake';
import { buildPaginator } from '../src/index';

describe('TypeORM cursor-based pagination column naming strategy test', () => {
  describe('Camel case naming strategy', () => {
    before(async () => {
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        synchronize: true,
        entities: [User, Photo],
        logging: true,
      });

      await prepareData();
    });

    it('should correctly paginate entities with camel case pagination keys', async () => {
      const queryBuilder = createQueryBuilder(User, 'user');
      const paginator = buildPaginator({
        entity: User,
        query: {
          limit: 1,
        },
        paginationKeys: ['camelCaseColumn'],
      });
      const result = await paginator.paginate(queryBuilder.clone());

      const nextPagePaginator = buildPaginator({
        entity: User,
        query: {
          limit: 1,
          afterCursor: result.cursor.afterCursor as string,
        },
        paginationKeys: ['camelCaseColumn'],
      });
      const nextResult = await nextPagePaginator.paginate(queryBuilder.clone());

      expect(nextResult.data).length(1);
    });

    after(async () => {
      await getConnection().query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
      await getConnection().close();
    });
  });

  describe('Snake case naming strategy test', () => {
    before(async () => {
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        synchronize: true,
        entities: [Snake],
        logging: true,
      });

      await prepareSnakeData();
    });

    it('should correctly paginate entities with snake case pagination keys', async () => {
      const queryBuilder = createQueryBuilder(Snake, 'snake');
      const paginator = buildPaginator({
        entity: Snake,
        query: {
          limit: 1,
        },
        paginationKeys: ['snakeCaseColumn'],
      });
      const result = await paginator.paginate(queryBuilder.clone());

      const nextPagePaginator = buildPaginator({
        entity: Snake,
        query: {
          limit: 1,
          afterCursor: result.cursor.afterCursor as string,
        },
        paginationKeys: ['snakeCaseColumn'],
      });
      const nextResult = await nextPagePaginator.paginate(queryBuilder.clone());

      expect(nextResult.data).length(1);
    });

    after(async () => {
      await getConnection().query('TRUNCATE TABLE snakes RESTART IDENTITY CASCADE;');
      await getConnection().close();
    });
  });
});
