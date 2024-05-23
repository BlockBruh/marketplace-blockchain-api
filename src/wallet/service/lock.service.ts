import { Injectable, Logger } from '@nestjs/common';
import { Mutex } from 'async-mutex';

@Injectable()
export class LockService {
  private readonly logger = new Logger(LockService.name);
  private mutex: Mutex;

  constructor() {
    this.mutex = new Mutex();
    this.logger.debug(`Initialized`);
  }

  async acquireLock(correlationId) {
    this.logger.log(
      `Try to acquire lock; correlationId: ${correlationId}`,
      correlationId,
    );
    const acquired = await this.mutex.acquire();
    this.logger.log(
      `Lock acquired; correlationId: ${correlationId}`,
      correlationId,
    );
    return acquired;
  }

  tryRelease = (released, release, correlationId) => {
    this.logger.log(`Try to release the lock; ${correlationId}`, correlationId);
    if (!released) {
      release();
      released = true;
    }
    this.logger.log(`Lock released; ${correlationId}`, correlationId);
    return released;
  };
}
