import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { Photo } from './Photo';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public name!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  public camelCaseColumn!: Date

  @OneToMany(
    () => Photo,
    (photo) => photo.user,
    {
      cascade: true,
    },
  )
  public photos!: Photo[]

  @CreateDateColumn()
  createdAt!: Date;
}
