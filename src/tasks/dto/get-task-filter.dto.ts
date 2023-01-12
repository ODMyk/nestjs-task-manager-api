import { TaskStatus } from '../task-status.enum';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTaskFilterDto {
  @ApiPropertyOptional({
    description: 'The status of the task',
    enum: Object.values(TaskStatus),
  })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @ApiPropertyOptional({
    description: "String that should be found in task's title or description",
  })
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
