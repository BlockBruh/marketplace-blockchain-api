import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Web3Service } from '../../web3/service/web3.service';

@Injectable()
export class Web3HealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(Web3HealthIndicator.name);

  constructor(private readonly web3Service: Web3Service) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let chainId: number;
    let isHealthy: boolean;
    try {
      chainId = await this.web3Service.getChainId();
      isHealthy = chainId !== null;
    } catch (e) {
      this.logger.log(e);
      isHealthy = false;
    }
    const result = this.getStatus(key, isHealthy, {});

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('web3 check failed', result);
  }
}
