import { expect } from 'chai';
import { createConnection, getConnection } from 'typeorm';

import { createQueryBuilder } from './utils/createQueryBuilder';
import { buildPaginator, PagingResult } from '../src/index';
import { Example } from './entities/Example';

describe('TypeORM cursor-based pagination test', () => {
  before(async () => {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [Example],
    });

    await getConnection().query('DROP TABLE IF EXISTS example;');
    await getConnection().query('CREATE TABLE example as SELECT generate_series(1, 10) AS id;');
  });

  let firstPageResult: PagingResult<Example>;
  let nextPageResult: PagingResult<Example>;

  it('should have afterCursor if the result set has next page', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator({
      entity: Example,
      query: {
        limit: 1,
      },
    });

    firstPageResult = await paginator.paginate(queryBuilder);

    expect(firstPageResult.cursor.afterCursor).to.not.eq(null);
    expect(firstPageResult.cursor.beforeCursor).to.eq(null);
    expect(firstPageResult.data[0].id).to.eq(10);
  });

  it('should have beforeCursor if the result set has prev page', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator({
      entity: Example,
      query: {
        limit: 1,
        afterCursor: firstPageResult.cursor.afterCursor as string,
      },
    });

    nextPageResult = await paginator.paginate(queryBuilder);

    expect(nextPageResult.cursor.afterCursor).to.not.eq(null);
    expect(nextPageResult.cursor.beforeCursor).to.not.eq(null);
    expect(nextPageResult.data[0].id).to.eq(9);
  });

  it('should return prev page result set if beforeCursor is set', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator({
      entity: Example,
      query: {
        limit: 1,
        beforeCursor: nextPageResult.cursor.beforeCursor as string,
      },
    });

    const result = await paginator.paginate(queryBuilder);

    expect(result.data[0].id).to.eq(10);
  });

  it('should return entities with given order', async () => {
    const ascQueryBuilder = createQueryBuilder();
    const ascPaginator = buildPaginator({
      entity: Example,
      query: {
        limit: 1,
        order: 'ASC',
      },
    });

    const descQueryBuilder = createQueryBuilder();
    const descPaginator = buildPaginator({
      entity: Example,
      query: {
        limit: 1,
        order: 'DESC',
      },
    });

    const ascResult = await ascPaginator.paginate(ascQueryBuilder);
    const descResult = await descPaginator.paginate(descQueryBuilder);

    expect(ascResult.data[0].id).to.eq(1);
    expect(descResult.data[0].id).to.eq(10);
  });

  it('should return entities with given limit', async () => {
    const queryBuilder = createQueryBuilder();
    const paginator = buildPaginator({
      entity: Example,
      query: {
        limit: 10,
      },
    });

    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(10);
  });

  it('should return empty array and null cursor if no data', async () => {
    const queryBuilder = createQueryBuilder().where('example.id > :id', { id: 10 });
    const paginator = buildPaginator({
      entity: Example,
    });
    const result = await paginator.paginate(queryBuilder);

    expect(result.data).length(0);
    expect(result.cursor.beforeCursor).to.eq(null);
    expect(result.cursor.afterCursor).to.eq(null);
  });

  after(async () => {
    await getConnection().query('TRUNCATE TABLE example;');
    await getConnection().close();
  });
});
