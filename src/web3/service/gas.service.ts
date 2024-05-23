import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { configService } from '../../config/config.service';
import { ExternalServiceException } from '../../util/exception/externalService.exception';

@Injectable()
export class GasService {
  private static URL = 'GAS_STATION_URL';
  private readonly logger = new Logger(GasService.name);

  constructor() {
    const gasStationUrl: string = configService.getValue(GasService.URL, false);
    if (gasStationUrl)
      axios
        .get(configService.getValue(GasService.URL))
        .then((result) => {
          this.logger.log(
            `Starting GasInfo: ${JSON.stringify(result.data, null, 4)}`,
          );
        })
        .catch((error) => this.logger.error(error));
  }

  async getFees() {
    const requestPath = configService.getValue(GasService.URL);
    try {
      const gasInfo = await axios.get(requestPath);
      return {
        maxPriorityFee: (
          Number(gasInfo.data.fast.maxPriorityFee) * 1e9
        ).toFixed(0),
        maxFee: (Number(gasInfo.data.fast.maxFee) * 1e9).toFixed(0),
      };
    } catch (e) {
      throw new ExternalServiceException(e, requestPath);
    }
  }
}
