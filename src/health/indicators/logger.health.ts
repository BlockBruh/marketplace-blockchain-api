import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { NRLoggerService } from '../../logger/service/newRelic.logging.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class LoggerHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(LoggerHealthIndicator.name);

  constructor(private readonly nrLogger: NRLoggerService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let loggerStatus: Promise<AxiosResponse<any>> | any;
    let isHealthy: boolean;
    try {
      loggerStatus = await this.nrLogger.healthCheck();
      isHealthy = loggerStatus.data.status === 'UP';
    } catch (e) {
      this.logger.log(e);
      isHealthy = false;
    }
    const result = this.getStatus(key, isHealthy, {});

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('New Relic check failed', result);
  }
}
