import {
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'example' })
export class Example {
  @PrimaryGeneratedColumn()
  public id!: number;
}
