import { HttpException, HttpStatus } from '@nestjs/common';
import { AbstractException } from '../abstract.exception';
import { ethers } from 'ethers';

export class TransactionException extends HttpException {
  constructor(error: any) {
    let cause: Error;
    let status: HttpStatus;
    let retry: boolean;
    if (error instanceof AbstractException) {
      cause = error.cause;
      status = error.errorType;
      retry = error.retry;
    } else {
      cause = error;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      retry = false;
    }
    const errorBody = HttpException.createBody({
      transaction_id: ethers.constants.HashZero,
      error: error.message,
      errorType: status,
      retry,
    });
    super(errorBody, status, { cause: cause });
  }
}
