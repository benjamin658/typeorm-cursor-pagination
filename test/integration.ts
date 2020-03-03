import { expect } from 'chai';
import { createConnection, getConnection } from 'typeorm';

describe('test', () => {
  before(async () => {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
    });

    await getConnection().query('CREATE TABLE example as SELECT generate_series(1, 10) AS id;');
  });

  it('should ok', () => {
    expect(1).to.eq(1);
  });

  after(async () => {
    await getConnection().query('TRUNCATE TABLE example;');
    await getConnection().close();
  });
});
