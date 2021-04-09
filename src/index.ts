import Paginator, { Order, Cursor, Nulls, PagingResult } from './Paginator';

export { Order, Cursor, Nulls, PagingResult };

export interface PagingQuery {
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
  order?: Order;
  nulls?: Nulls;
}

export interface PaginationOptions<Entity> {
  entity: { new(): Entity };
  alias?: string;
  query?: PagingQuery;
  paginationKeys?: Extract<keyof Entity, string>[];
}

export function buildPaginator<Entity>(options: PaginationOptions<Entity>): Paginator<Entity> {
  const { entity } = options;
  const query: PagingQuery = options.query || {};
  const alias = entity.name.toLowerCase();
  const paginationKeys = options.paginationKeys || ['id' as any];
  const paginator = new Paginator(entity, paginationKeys);
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
    paginator.setOrder(query.order);
  }
  if (query.nulls) {
    paginator.setNulls(query.nulls);
  }
  return paginator;
}
