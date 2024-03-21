import { Module } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { createClient } from 'redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6380
          }
        })
        await client.connect();
        return client;
      }
    },
  ],
  exports: ['REDIS_CLIENT']
})
export class CacheModule {}
