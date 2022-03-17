import { getConnection } from 'typeorm';
import { User } from '../entities/User';
import { Snake } from '../entities/Snake';

function setTimestamp(i: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + i);

  return now;
}

function getRandomFloat(min: number, max: number): number {
  const str = (Math.random() * (max - min) + min).toFixed(2);

  return parseFloat(str);
}

export async function prepareData(): Promise<void> {
  const data = [...Array(10).keys()].map((i) => ({
    name: `user${i}`,
    balance: getRandomFloat(1, 2),
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
