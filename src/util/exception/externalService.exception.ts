import { AxiosError } from 'axios';
import { AbstractException } from './abstract.exception';

export class ExternalServiceException extends AbstractException {
  constructor(error: AxiosError, request: string) {
    const message = `${error.message}: ${request}`;
    super(message);
    this.cause = error;
    this.errorType = error.response.status;
    this.retry = false;
  }
}
