import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({description: 'The title of the task'})
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: 'The description of the task'})
  @IsNotEmpty()
  description: string;
}
