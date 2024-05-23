import { AbstractException } from './abstract.exception';

export class NonceException extends AbstractException {
  constructor(error: any) {
    const message = error instanceof Error ? error.message : error;
    super(message);
    this.retry = true;
  }
}
