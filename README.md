# TypeORM Cursor Pagniation

[![Build Status](https://travis-ci.com/benjamin658/typeorm-cursor-pagination.svg?branch=master)](https://travis-ci.com/benjamin658/typeorm-cursor-pagination)
[![Coverage Status](https://coveralls.io/repos/github/benjamin658/typeorm-cursor-pagination/badge.svg?branch=master)](https://coveralls.io/github/benjamin658/typeorm-cursor-pagination?branch=master)
[![npm version](https://badge.fury.io/js/typeorm-cursor-pagination.svg)](https://badge.fury.io/js/typeorm-cursor-pagination)
[![license](https://img.shields.io/github/license/benjamin658/typeorm-cursor-pagination)](https://github.com/benjamin658/typeorm-cursor-pagination/blob/master/License)

Cursor-based pagination works with [TypeORM Query Builder](https://typeorm.io/#/select-query-builder).

## Installation

`npm install typeorm-cursor-pagination --save`

## Usage

Query first page without any cursor

```typescript
import { getConnection } from "typeorm";
import { buildPaginator } from 'typeorm-cursor-pagination';

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
const { data, cursor } = await paginator.paginate(queryBuilder);
```

The `buildPaginator` function has the following options:

* `entity` [required]: TypeORM entity.
* `alias` [optional]: alias of the query builder.
* `paginationKeys` [optional]: array of the fields to be used for the pagination, **default is `id`**.
* `query` [optional]:
  * `limit`: limit the number of records returned, **default is 100**.
  * `order`: **ASC** or **DESC**, **default is DESC**.
  * `beforeCursor`: the before cursor.
  * `afterCursor`: the after cursor.

`paginator.paginate(queryBuilder)` returns the entities and cursor for next iteration

```typescript
interface PagingResult<Entity> {
  data: Entity[];
  cursor: Cursor;
}

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

Released under the [MIT License](https://github.com/benjamin658/typeorm-cursor-pagination/blob/master/License)
