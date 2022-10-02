import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task.model';

export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
