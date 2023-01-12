import { TaskEntity } from './task.entity';
import { TaskDto } from './dto/task.dto';
import { UserEntity } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from "./task-status.enum";

export class TaskMapper {
  static toDto(entity: TaskEntity): TaskDto {
    const { user, userId, ...dto } = entity;
    return dto;
  }

  static toCreateEntity(user: UserEntity, data: CreateTaskDto): TaskEntity {
    return Object.assign(new TaskEntity(), data, {
      userId: user.id,
      status: TaskStatus.OPEN,
    });
  }

  static toUpdateEntity(entity: TaskEntity, data: UpdateTaskDto) {
    return Object.assign(entity, data);
  }
}
