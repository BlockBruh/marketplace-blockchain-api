import { AbstractException } from './abstract.exception';
import { HttpStatus } from '@nestjs/common';

export class SignatureException extends AbstractException {
  constructor(error: string | Error) {
    const message = error instanceof Error ? error.message : error;
    super(message);
    this.retry = false;
    if (error instanceof Error) {
      this.cause = error;
      this.errorType = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      this.errorType = HttpStatus.BAD_REQUEST;
    }
  }
}
