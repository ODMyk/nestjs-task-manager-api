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
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
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
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
      "Returns array of task DTO's, that have current user as owner and satisfy search filters",
    type: [TaskDto],
  })
  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskDto[]> {
    this.logger.verbose(
      `User with username "${
        user.username
      }" retrieves tasks with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @ApiOkResponse({
    description: 'Returns a task with given id',
    type: TaskDto,
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to get not his task or non-existing task',
  })
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<TaskDto> {
    this.logger.verbose(
      `User with username "${user.username}" tries to retrieve task with id ${id}`,
    );
    return this.tasksService.getTaskByID(id, user);
  }

  @ApiCreatedResponse({
    description: 'Returns created task DTO',
    type: TaskDto,
  })
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskDto> {
    this.logger.verbose(
      `User with username "${
        user.username
      }" tries to create new task. DTO: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @ApiOkResponse({
    description: 'Deletes task with given id',
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to delete not his task or non-existing task',
  })
  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    this.logger.verbose(
      `User with username "${user.username}" tries to delete task with id ${id}`,
    );
    return this.tasksService.deleteTask(id, user);
  }

  @ApiBody({
    type: UpdateTaskDto,
  })
  @ApiOkResponse({
    description: 'Updates task with given id and returns new task DTO',
    type: TaskDto,
  })
  @ApiNotFoundResponse({
    description:
      'Happens when user tries to update not his task or non-existing task',
  })
  @ApiBadRequestResponse({
    description: 'Happens when invalid status used',
  })
  @Patch('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskDto> {
    this.logger.verbose(
      `User with username "${
        user.username
      }" tries to update task with id: ${id}. UpdateTaskDto: ${JSON.stringify(
        updateTaskDto,
      )}`,
    );
    return this.tasksService.updateTask(id, user, updateTaskDto);
  }
}
