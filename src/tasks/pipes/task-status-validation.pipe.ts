import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.values(TaskStatus);

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isValid(value)) {
      throw new BadRequestException(`"${value}" is not a valid status`);
    }

    return value;
  }

  private isValid(status: any) {
    const ind = this.allowedStatuses.indexOf(status);
    return ind !== -1;
  }
}
