import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  public link!: string;

  @ManyToOne(
    () => User,
    (user) => user.photos,
  )
  public user!: User;
}
