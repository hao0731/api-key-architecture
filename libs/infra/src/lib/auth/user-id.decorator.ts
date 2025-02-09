import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { USER_ID_HEADER } from '../constants';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers[USER_ID_HEADER];
  }
);
