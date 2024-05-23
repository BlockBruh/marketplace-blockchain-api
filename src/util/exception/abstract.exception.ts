import { HttpStatus } from '@nestjs/common';

export class AbstractException extends Error {
  errorType: HttpStatus;
  cause: Error;
  retry: boolean;

  constructor(message: string) {
    super(message);
  }
}
