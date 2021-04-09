import { expect } from 'chai';
import { createConnection, getConnection } from 'typeorm';

import { createQueryBuilder } from './utils/createQueryBuilder';
import { prepareData } from './utils/prepareData';
import { User } from './entities/User';
import { Photo } from './entities/Photo';
import { buildPaginator } from '../src';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PagingResult } from '../lib';

describe('TypeORM cursor-based pagination test', () => {
  before(async () => {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
      entities: [User, Photo],
      logging: true,
    });

    await prepareData();
  });

  describe('should paginate correctly with before and after cursor', () => {

    let firstPageResult: PagingResult<User>;
    let nextPageResult: PagingResult<User>;
    let prevPageResult: PagingResult<User>;

    before(async () => {
      const queryBuilder = createQueryBuilder().leftJoinAndSelect('user.photos', 'photo');
      const firstPagePaginator = buildPaginator<User>({
        entity: User,
        paginationKeys: ['id', 'name', 'timestamp'],
        query: {
          limit: 1,
        },
      });
      firstPageResult = await firstPagePaginator.paginate(queryBuilder.clone());
      const nextPagePaginator = buildPaginator<User>({
        entity: User,
        paginationKeys: ['id', 'name', 'timestamp'],
        query: {
          limit: 1,
          afterCursor: firstPageResult.cursor.afterCursor as string,
        },
      });
      nextPageResult = await nextPagePaginator.paginate(queryBuilder.clone());

      const prevPagePaginator = buildPaginator<User>({
        entity: User,
        paginationKeys: ['id', 'name', 'timestamp'],
        query: {
          limit: 1,
          beforeCursor: nextPageResult.cursor.beforeCursor as string,
        },
      });
      prevPageResult = await prevPagePaginator.paginate(queryBuilder.clone());
    });

    it('the first page result has a null before cursor', () => {
      expect(firstPageResult.cursor.beforeCursor).to.eq(null);
    });

    it('the first page result has a non-null after cursor', () => {
      expect(firstPageResult.cursor.afterCursor).to.not.eq(null);
    });

    it('the first page result has id 10 in the first item', () => {
      expect(firstPageResult.data[0].id).to.eq(10);
    });

    it('the next page result has a non-null before cursor', () => {
      expect(nextPageResult.cursor.beforeCursor).to.not.eq(null);
    });

    it('the next page result has a non-null after cursor', () => {
      expect(nextPageResult.cursor.afterCursor).to.not.eq(null);
    });

    it('the next page result has 9 as the first item', () => {
      expect(nextPageResult.data[0].id).to.eq(9);
    });

    it('the prev page result has a null before cursor', () => {
      expect(prevPageResult.cursor.beforeCursor).to.eq(null);
    });

    it('the prev page result has a non-null after cursor', () => {
      expect(prevPageResult.cursor.afterCursor).to.not.eq(null);
    });

    it('the prev page result has 10 as the first item', () => {
      expect(prevPageResult.data[0].id).to.eq(10);
    });
  });

  it('should return entities with given order', async () => {
    const queryBuilder = createQueryBuilder();
    const ascPaginator = buildPaginator({
      entity: User,
      query: {
        limit: 1,
        order: 'ASC',
      },
    });
    const descPaginator = buildPaginator({
      entity: User,
      query: {
        limit: 1,
        order: 'DESC',
      },
    });

    const ascResult = await ascPaginator.paginate(queryBuilder.clone());
    const descResult = await descPaginator.paginate(queryBuilder.clone());

    expect(ascResult.data[0].id).to.eq(1);
    expect(descResult.data[0].id).to.eq(10);
  });

  it('should return entities with given limit', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator({
      entity: User,
      query: {
        limit: 10,
      },
    });

    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(10);
  });

  it('should return empty array and null cursor if no data', async () => {
    const queryBuilder = createQueryBuilder().where('user.id > :id', { id: 10 });
    const paginator = buildPaginator({
      entity: User,
    });
    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(0);
    expect(result.cursor.beforeCursor).to.eq(null);
    expect(result.cursor.afterCursor).to.eq(null);
  });

  it('should correctly paginate entities with camel-cased pagination keys', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator<User>({
      entity: User,
      paginationKeys: ['createdAt', 'id'],
    });
    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(10);
  });

  after(async () => {
    await getConnection().query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
    await getConnection().close();
  });
});
