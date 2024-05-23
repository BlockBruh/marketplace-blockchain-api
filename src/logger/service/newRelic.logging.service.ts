import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NewRelicConstants } from '../util/constants';
import { NewRelicEventDTO } from '../model/newRelicEvent.dto';
import { configService } from '../../config/config.service';
import { BigNumber, BigNumberish } from 'ethers';
import { FunctionData } from '../../wallet/model/function.data';

@Injectable()
export class NRLoggerService {
  private static URL = 'LOGGING_API_URL';
  private readonly logger = new Logger(NRLoggerService.name);

  private readonly loggingApiUrl;

  constructor() {
    this.loggingApiUrl = configService.getValue(NRLoggerService.URL);
    this.logger.debug(`Initialized`);
  }

  async healthCheck() {
    const config = {
      method: 'get',
      url: this.loggingApiUrl + NewRelicConstants.LOGGING_HEALTH_URL_SUFFIX,
    };
    return axios(config);
  }

  async logNonceEvent(
    operation: string,
    txCount: BigNumber,
    currentCachedNonce: BigNumber,
    txNonce: BigNumber,
    cachedNonce: BigNumber,
  ) {
    const attributes = new Map<string, string>();
    attributes.set(NewRelicConstants.NONCE_DESCRIPTION, operation);
    attributes.set(NewRelicConstants.NONCE_TX_COUNT, txCount.toString());
    attributes.set(
      NewRelicConstants.NONCE_CURRENT_CACHED,
      currentCachedNonce.toString(),
    );
    attributes.set(NewRelicConstants.NONCE_TX_NONCE, txNonce.toString());
    attributes.set(NewRelicConstants.NONCE_CACHED, cachedNonce.toString());

    await this.logNewRelicEvent(
      new NewRelicEventDTO(NewRelicConstants.NONCE_EVENT_TYPE, attributes),
    );
  }

  async logTransactionHashEvent(
    contractFunction: FunctionData,
    nonce,
    transactionHash,
    correlationId,
  ) {
    await this.logNewRelicEvent(
      this.buildInternalTransactionEvent(
        NewRelicConstants.INTERNAL_EVENT_REQUEST_TYPE,
        contractFunction,
        nonce,
        correlationId,
        transactionHash,
      ),
    );
  }
  async logTransactionErrorEvent(
    message,
    contractFunction: FunctionData,
    nonce,
    correlationId,
  ) {
    await this.logNewRelicEvent(
      this.buildInternalTransactionEvent(
        NewRelicConstants.INTERNAL_EVENT_ERROR_TYPE,
        contractFunction,
        nonce,
        correlationId,
      ),
    );
  }

  async logCleanup(from: BigNumberish, to: BigNumberish) {
    const attributes = new Map<string, string>();
    attributes.set(NewRelicConstants.FROM, from.toString());
    attributes.set(NewRelicConstants.TO, to.toString());
    await this.logNewRelicEvent(
      new NewRelicEventDTO(NewRelicConstants.CLEANUP_EVENT_NAME, attributes),
    );
  }

  private async logNewRelicEvent(event: NewRelicEventDTO) {
    const config = {
      method: 'post',
      url: this.loggingApiUrl + NewRelicConstants.LOGGING_URL_SUFFIX,
      headers: {
        'Content-Type': NewRelicConstants.CONTENT_TYPE_JSON,
      },
      data: event.toJSON(),
    };
    await axios(config)
      .then(() => {
        this.logger.log(
          `Success calling logging api for event: ${event.eventType}`,
          event.attributes.get(NewRelicConstants.CORRELATION_ID),
        );
      })
      .catch((error) => {
        this.logger.error('Failed calling logging api', error);
      });
  }

  private buildInternalTransactionEvent(
    eventType,
    contractFunction: FunctionData,
    nonce,
    correlationId,
    transactionHash = null,
  ): NewRelicEventDTO {
    const attributes = new Map();
    attributes.set(NewRelicConstants.FUNCTION_NAME, contractFunction.name);
    attributes.set(NewRelicConstants.NONCE, nonce.toString());
    attributes.set(NewRelicConstants.TX_HASH, transactionHash);
    attributes.set(NewRelicConstants.INTERNAL_TIMESTAMP, Date.now());
    attributes.set(
      NewRelicConstants.CALLDATA,
      this.serializeCalldata(contractFunction.arguments),
    );
    attributes.set(
      NewRelicConstants.NETWORK,
      configService.getValue('NETWORK_NAME'),
    );
    attributes.set(NewRelicConstants.ENV, configService.getValue('MODE'));
    attributes.set(NewRelicConstants.FROM_ADDRESS, contractFunction.from);
    attributes.set(NewRelicConstants.TO_ADDRESS, contractFunction.to);
    attributes.set(NewRelicConstants.CORRELATION_ID, correlationId);

    return new NewRelicEventDTO(eventType, attributes);
  }

  private serializeCalldata(calldata) {
    return JSON.stringify(calldata).replace(/\"/g, '');
  }
}
