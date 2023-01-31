import { expect } from 'chai';
import { createConnection, getConnection } from 'typeorm';

import { createQueryBuilder } from './utils/createQueryBuilder';
import { prepareData } from './utils/prepareData';
import { User } from './entities/User';
import { Photo } from './entities/Photo';
import { buildPaginator, Order } from '../src/index';

describe('TypeORM cursor-based pagination test', () => {
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

  it('should paginate correctly with before and after cursor', async () => {
    const queryBuilder = createQueryBuilder(User, 'user').leftJoinAndSelect('user.photos', 'photo');
    const firstPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 1,
      },
    });
    const firstPageResult = await firstPagePaginator.paginate(queryBuilder.clone());

    const nextPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 1,
        afterCursor: firstPageResult.cursor.afterCursor as string,
      },
    });
    const nextPageResult = await nextPagePaginator.paginate(queryBuilder.clone());

    const prevPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 1,
        beforeCursor: nextPageResult.cursor.beforeCursor as string,
      },
    });
    const prevPageResult = await prevPagePaginator.paginate(queryBuilder.clone());

    expect(firstPageResult.cursor.beforeCursor).to.eq(null);
    expect(firstPageResult.cursor.afterCursor).to.not.eq(null);
    expect(firstPageResult.data[0].id).to.eq(10);

    expect(nextPageResult.cursor.beforeCursor).to.not.eq(null);
    expect(nextPageResult.cursor.afterCursor).to.not.eq(null);
    expect(nextPageResult.data[0].id).to.eq(9);

    expect(prevPageResult.cursor.beforeCursor).to.eq(null);
    expect(prevPageResult.cursor.afterCursor).to.not.eq(null);
    expect(prevPageResult.data[0].id).to.eq(10);
  });

  it('should paginate correctly with a float column in pagination keys', async () => {
    const queryBuilder = createQueryBuilder(User, 'user');
    const firstPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['balance', 'id'],
      query: {
        limit: 2,
      },
    });
    const firstPageResult = await firstPagePaginator.paginate(queryBuilder.clone());

    const nextPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['balance', 'id'],
      query: {
        limit: 2,
        afterCursor: firstPageResult.cursor.afterCursor as string,
      },
    });
    const nextPageResult = await nextPagePaginator.paginate(queryBuilder.clone());

    expect(firstPageResult.data[1].id).to.not.eq(nextPageResult.data[0].id);
    expect(firstPageResult.data[1].balance).to.be.above(nextPageResult.data[0].balance);
    expect(firstPageResult.data[0].id).to.eq(10);
    expect(nextPageResult.data[0].id).to.eq(8);
  });

  it('should return entities with given order', async () => {
    const queryBuilder = createQueryBuilder(User, 'user');
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
        order: Order.DESC,
      },
    });

    const ascResult = await ascPaginator.paginate(queryBuilder.clone());
    const descResult = await descPaginator.paginate(queryBuilder.clone());

    expect(ascResult.data[0].id).to.eq(1);
    expect(descResult.data[0].id).to.eq(10);
  });

  it('should return entities with given limit', async () => {
    const queryBuilder = createQueryBuilder(User, 'user');
    const paginator = buildPaginator({
      entity: User,
      query: {
        limit: 5,
      },
    });

    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(5);
  });

  it('should return empty array and null cursor if no data', async () => {
    const queryBuilder = createQueryBuilder(User, 'user').where('user.id > :id', { id: 10 });
    const paginator = buildPaginator({
      entity: User,
    });
    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(0);
    expect(result.cursor.beforeCursor).to.eq(null);
    expect(result.cursor.afterCursor).to.eq(null);
  });

  it('should correctly include cursor record', async () => {
    const queryBuilder = createQueryBuilder(User, 'user').leftJoinAndSelect('user.photos', 'photo');
    const firstPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 3,
      },
    });
    const firstPageResult = await firstPagePaginator.paginate(queryBuilder.clone());

    const nextPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 3,
        afterCursor: firstPageResult.cursor.afterCursor as string,
        includeCursor: true,
      },
    });
    const nextPageResult = await nextPagePaginator.paginate(queryBuilder.clone());

    const afterPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 3,
        afterCursor: nextPageResult.cursor.afterCursor as string,
        includeCursor: true,
      },
    });
    const afterPageResult = await afterPagePaginator.paginate(queryBuilder.clone());

    const prevPagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 3,
        beforeCursor: afterPageResult.cursor.beforeCursor as string,
        includeCursor: true,
      },
    });
    const prevPageResult = await prevPagePaginator.paginate(queryBuilder.clone());

    const beforePagePaginator = buildPaginator({
      entity: User,
      paginationKeys: ['id', 'name'],
      query: {
        limit: 3,
        beforeCursor: prevPageResult.cursor.beforeCursor as string,
        includeCursor: true,
      },
    });
    const beforePageResult = await beforePagePaginator.paginate(queryBuilder.clone());

    expect(firstPageResult.data[0].id).to.eq(10);
    expect(firstPageResult.data[1].id).to.eq(9);
    expect(firstPageResult.data[2].id).to.eq(8);

    expect(nextPageResult.data[0].id).to.eq(8);
    expect(nextPageResult.data[1].id).to.eq(7);
    expect(nextPageResult.data[2].id).to.eq(6);

    expect(afterPageResult.data[0].id).to.eq(6);
    expect(afterPageResult.data[1].id).to.eq(5);
    expect(afterPageResult.data[2].id).to.eq(4);

    expect(prevPageResult.data[0].id).to.eq(8);
    expect(prevPageResult.data[1].id).to.eq(7);
    expect(prevPageResult.data[2].id).to.eq(6);

    expect(beforePageResult.data[0].id).to.eq(10);
    expect(beforePageResult.data[1].id).to.eq(9);
    expect(beforePageResult.data[2].id).to.eq(8);
  });

  after(async () => {
    await getConnection().query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
    await getConnection().close();
  });
});
