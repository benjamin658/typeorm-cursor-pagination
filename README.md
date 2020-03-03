# TypeORM Cursor Pagniation

[![Build Status](https://travis-ci.com/benjamin658/typeorm-cursor-pagination.svg?branch=master)](https://travis-ci.com/benjamin658/typeorm-cursor-pagination)
[![license](https://img.shields.io/github/license/benjamin658/typeorm-cursor-pagination)](https://github.com/benjamin658/typeorm-cursor-pagination/blob/master/License)

Cursor-based pagination works with [TypeORM Query Builder](https://typeorm.io/#/select-query-builder).

## Usage

Query first page without any cursor

```typescript
import { getConnection } from "typeorm";

const queryBuilder = getConnection()
  .getRepository(User)
  .createQueryBuilder('user')
  .where("user.gender = :gender", { gender: 'male' });

const paginator = buildPaginator({
  entity: User,
  query: {
    limit: 10,
    order: 'ASC',
  },
});

// Pass queryBuilder as parameter to get paginate result.
const result: User[] = await paginator.paginate(queryBuilder);

// Get cursor for next iteration
const cursor = paginator.getCursor();
```

The `buildPaginator` function has the following options:

* `entity` [required]: TypeORM entity.
* `alias` [optional]: alias of the query builder.
* `paginationKeys` [optional]: array of the fields to be used for the pagination, **default is `id`**.
* `query` [optional]:
  * `limit`: limit the number of records returned, **default is 100**.
  * `order`: **ASC** or **DESC**, default is **DESC**.
  * `beforeCursor`: the before cursor.
  * `afterCursor`: the after cursor.

Cursor returns by `paginator.getCursor()` for next iteration

```typescript
interface Cursor {
  beforeCursor: string | null;
  afterCursor: string | null;
}
```

Query next page by `afterCursor`

```typescript
const nextPaginator = buildPaginator({
  entity: User,
  query: {
    limit: 10,
    order: 'ASC',
    afterCursor: cursor.afterCursor,
  },
});
```

Query prev page by `beforeCursor`

```typescript
const prevPaginator = buildPaginator({
  entity: User,
  query: {
    limit: 10,
    order: 'ASC',
    beforeCursor: cursor.beforeCursor,
  },
});
```

## Integration Test with Docker

To start a integration test, run the following command:  

`npm run test:docker`

## License

© Ben Hu (benjamin658), 2020-NOW

Released under the [MIT License](https://github.com/benjamin658/typeorm-cursor-pagination/blob/master/LICENSE)
