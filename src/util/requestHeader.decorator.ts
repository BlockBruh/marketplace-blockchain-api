import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const RequestHeader = createParamDecorator(
  async (property: string | number | symbol, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    if (
      typeof property === 'string' ||
      typeof property === 'number' ||
      typeof property === 'symbol'
    ) {
      return headers[property];
    }

    return headers;
  },
);

export function GeneralHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'correlation_id',
      required: true,
    }),
  );
}
