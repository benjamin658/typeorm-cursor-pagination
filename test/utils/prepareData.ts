import { getConnection } from 'typeorm';
import { User } from '../entities/User';
import { Snake } from '../entities/Snake';

function setTimestamp(i: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + i);

  return now;
}

const balances = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2];

export async function prepareData(): Promise<void> {
  const data = [...Array(10).keys()].map((i) => ({
    name: `user${i}`,
    balance: balances[i],
    camelCaseColumn: setTimestamp(i),
    photos: [
      {
        link: `http://photo.com/${i}`,
      },
    ],
  }));

  await getConnection()
    .getRepository(User)
    .save(data);
}

export async function prepareSnakeData(): Promise<void> {
  const data = [...Array(10).keys()].map((i) => ({
    snakeCaseColumn: setTimestamp(i),
  }));

  await getConnection()
    .getRepository(Snake)
    .save(data);
}
