import { AbstractException } from './abstract.exception';
import { HttpStatus } from '@nestjs/common';

export class MissingDataException extends AbstractException {
  constructor(message: string) {
    super(message);
    this.cause = null;
    this.errorType = HttpStatus.BAD_REQUEST;
    this.retry = false;
  }
}
