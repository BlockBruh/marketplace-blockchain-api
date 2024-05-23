import { HttpException, HttpStatus } from '@nestjs/common';
import { AbstractException } from '../abstract.exception';

export class ResponseException extends HttpException {
  constructor(error: Error) {
    let cause: Error;
    let status: HttpStatus;
    if (error instanceof AbstractException) {
      cause = error.cause;
      status = error.errorType;
    } else {
      cause = error;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    const errorBody = HttpException.createBody({
      error: error.message,
      errorType: status,
    });
    super(errorBody, status, { cause: cause });
  }
}
