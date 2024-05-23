import { Logger, Module } from '@nestjs/common';
import { configService } from '../config/config.service';
import { LoggerModule } from '../logger/logger.module';
import { CacheService } from './service/cache.service';
import { RedisConfig } from '../config/model/config.data';
import Redis from 'ioredis';
import { RedisObjects } from './util/constants';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: RedisObjects.OPTIONS,
      useValue: configService.getRedisConfig(),
    },
    {
      provide: RedisObjects.KEYS,
      useValue: configService.getRedisKeys(),
    },
    {
      inject: [RedisObjects.OPTIONS],
      provide: RedisObjects.CLIENT,
      useFactory: async (config: RedisConfig) => {
        let client: Redis;
        try {
          client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            tls: config.isTls
              ? {
                  servername: config.host,
                }
              : undefined,
          });
        } catch (e) {
          RedisModule.logger.error(e);
        }
        if (
          client.status === 'connect' ||
          client.status === 'connecting' ||
          client.status === 'reconnecting' ||
          client.status === 'ready'
        ) {
          //DO nothing
        } else {
          await client.connect();
        }
        client.on('error', function (error) {
          RedisModule.logger.error(error);
        });
        return client;
      },
    },
    CacheService,
  ],
  exports: [RedisObjects.CLIENT, RedisObjects.KEYS, CacheService],
})
export class RedisModule {
  private static logger = new Logger(RedisModule.name);
}
