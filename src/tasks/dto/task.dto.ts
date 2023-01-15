import { TaskStatus } from '../task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: Object.values(TaskStatus) })
  status: TaskStatus;
}
