import { TaskStatus } from '../task-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    enum: Object.values(TaskStatus),
  })
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
