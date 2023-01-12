import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from "./user.entity";

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    return ctx.switchToHttp().getRequest().user;
  },
);
