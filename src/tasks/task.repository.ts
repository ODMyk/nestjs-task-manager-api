import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private readonly logger: Logger;

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
    this.logger = new Logger(TaskRepository.name);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = Object.assign(new Task(), createTaskDto, {
      userId: user.id,
      status: TaskStatus.OPEN,
    });

    try {
      await task.save();
      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create new task for user with username "${
          user.username
        }". DTO: ${JSON.stringify(createTaskDto)}`,
        error.trace,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const query = this.dataSource
      .getRepository(Task)
      .createQueryBuilder('task');

    query.andWhere('task.userId = :userId', { userId: user.id });

    const { search, status } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve tasks for user with username "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.trace,
      );
      throw new InternalServerErrorException();
    }
  }
}
