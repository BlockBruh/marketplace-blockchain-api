import { NRLoggerService } from './service/newRelic.logging.service';
import { AILoggerService } from './service/appInsights.logging.service';
import { Global, Module } from '@nestjs/common';
import { LoggerConfig } from './util/config';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [WinstonModule],
  exports: [AILoggerService, NRLoggerService],
  providers: [
    AILoggerService,
    NRLoggerService,
    {
      provide: 'ApplicationInsights',
      useValue: require('applicationinsights'),
    },
    LoggerConfig,
  ],
})
export class LoggerModule {}
