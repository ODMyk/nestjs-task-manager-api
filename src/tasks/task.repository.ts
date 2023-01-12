import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserEntity } from '../auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './task-mapper';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  private readonly logger: Logger;

  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
    this.logger = new Logger(TaskRepository.name);
  }

  async getTaskById(taskId: number, userId: number): Promise<TaskEntity> {
    return this.findOne({
      where: { id: taskId, userId },
    });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = TaskMapper.toCreateEntity(user, createTaskDto);

    try {
      await task.save();
      this.logger.verbose('Task created successfully');
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

  async getTasks(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const query = this.dataSource
      .getRepository(TaskEntity)
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

  async updateTask(
    taskEntity: TaskEntity,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const newEntity = TaskMapper.toUpdateEntity(taskEntity, updateTaskDto);

    try {
      await newEntity.save();
      this.logger.verbose('Task updated successfully')
      return newEntity;
    } catch (error) {
      this.logger.error(
        `Failed to update task with id: ${
          newEntity.id
        } for user with username "${
          newEntity.user.username
        }". UpdateTaskDto: ${JSON.stringify(updateTaskDto)}`,
        error.trace,
      );
      throw new InternalServerErrorException();
    }
  }
}
