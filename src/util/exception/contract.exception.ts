import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class ContractException extends AbstractException {
  constructor(error: Error, name: string, args: any) {
    const message = `${name}: [${args}]`;
    super(message);
    this.cause = error;
    this.retry = false;
    this.errorType = getStatusByError(name);
  }
}

function getStatusByError(errorName: string): HttpStatus {
  if (!errorName) return HttpStatus.INTERNAL_SERVER_ERROR;
  switch (errorName) {
    case 'MISSING_ROLE':
    case 'NotOwner':
    case 'NotCreator':
      return HttpStatus.FORBIDDEN;
    case 'PAYMENT_TOKEN_NOT_ACCEPTED':
      return HttpStatus.NOT_ACCEPTABLE;
    case 'TokenUriAlreadyFrozen':
      return HttpStatus.CONFLICT;
    default:
      return HttpStatus.BAD_REQUEST;
  }
}
