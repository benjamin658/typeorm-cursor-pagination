import { ObjectType } from 'typeorm';

import Paginator, { Order } from './Paginator';

export interface PagingQuery {
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
  order?: Order | 'ASC' | 'DESC';
}

export interface PaginationOptions<Entity> {
  entity: ObjectType<Entity>;
  alias?: string;
  query?: PagingQuery;
  paginationKeys?: Extract<keyof Entity, string>[];
  paginationUniqueKey?: Extract<keyof Entity, string>;
}

export function buildPaginator<Entity>(options: PaginationOptions<Entity>): Paginator<Entity> {
  const {
    entity,
    query = {},
    alias = entity.name.toLowerCase(),
    paginationKeys = ['id' as any],
    paginationUniqueKey = 'id' as any,
  } = options;

  const paginator = new Paginator(entity, paginationKeys, paginationUniqueKey);

  paginator.setAlias(alias);

  if (query.afterCursor) {
    paginator.setAfterCursor(query.afterCursor);
  }

  if (query.beforeCursor) {
    paginator.setBeforeCursor(query.beforeCursor);
  }

  if (query.limit) {
    paginator.setLimit(query.limit);
  }

  if (query.order) {
    paginator.setOrder(query.order as Order);
  }

  return paginator;
}
