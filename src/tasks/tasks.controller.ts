import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger: Logger;

  constructor(private tasksService: TasksService) {
    this.logger = new Logger(TasksController.name);
  }

  @ApiOkResponse({
    description:
      'Returns array of tasks, that have current user as owner and satisfy search filters',
    type: [Task],
  })
  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User with username "${
        user.username
      }" retrieves tasks with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @ApiOkResponse({
    description: 'Returns a task with given id',
    type: Task,
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to get not his task or non-existing task',
  })
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User with username "${user.username}" retrievese task with id ${id}`,
    );
    return this.tasksService.getTaskByID(id, user);
  }

  @ApiCreatedResponse({ description: 'Returns created task', type: Task })
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User with username "${
        user.username
      }" creates new task. DTO: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @ApiOkResponse({
    description: 'Deletes task with given id',
    type: Task,
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to delete not his task or non-existing task',
  })
  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(
      `User with username "${user.username}" deletes task with id ${id}`,
    );
    return this.tasksService.deleteTask(id, user);
  }

  @ApiBody({
    description: 'Status to install for given task',
    enum: Object.values(TaskStatus),
  })
  @ApiOkResponse({
    description: 'Updates task status with given id',
    type: Task,
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to update not his task or non-existing task',
  })
  @ApiBadRequestResponse({
    description: 'Happens when invalid status used',
  })
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User with username "${user.username}" updates task's(id: ${id}) status to ${status}`,
    );
    return this.tasksService.updateTaskStatus(id, user, status);
  }
}
