import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { TaskDto } from './dto/task.dto';
import { TaskMapper } from './task-mapper';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {
    this.logger = new Logger(TasksService.name);
  }

  async getTasks(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TaskDto[]> {
    return this.taskRepository
      .getTasks(filterDto, user)
      .then((entitiesList: TaskEntity[]) =>
        entitiesList.map((entity: TaskEntity) => TaskMapper.toDto(entity)),
      );
  }

  async getTaskByID(id: number, user: UserEntity): Promise<TaskDto> {
    const found = await this.taskRepository.getTaskById(id, user.id);

    if (!found) {
      this.logger.verbose(
        `Task not found`,
      );
      throw new NotFoundException(`Task with id "${id}" does not exist`);
    }

    this.logger.verbose(`Task found successfully`);
    return TaskMapper.toDto(found);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskDto> {
    return this.taskRepository
      .createTask(createTaskDto, user)
      .then((entity: TaskEntity) => TaskMapper.toDto(entity));
  }

  async deleteTask(id: number, user: UserEntity): Promise<void> {
    const found = await this.taskRepository.delete({ id, userId: user.id });

    if (found.affected === 0) {
      this.logger.verbose('Task not found');
      throw new NotFoundException(`Task with id "${id}" does not exist`);
    }

    this.logger.verbose('Task deleted successfully');
  }

  async updateTask(
    taskId: number,
    user: UserEntity,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    const found = await this.taskRepository.getTaskById(taskId, user.id);

    if (!found) {
      this.logger.verbose('Task not found');
      throw new NotFoundException(`Task with id "${taskId}" does not exist`);
    }

    return this.taskRepository
      .updateTask(found, updateTaskDto)
      .then((entity: TaskEntity) => TaskMapper.toDto(entity));
  }
}
