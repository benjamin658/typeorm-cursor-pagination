import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'snakes' })
export class Snake {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    name: 'snake_case_column',
    type: 'timestamp',
    nullable: false,
  })
  public snakeCaseColumn!: Date
}
