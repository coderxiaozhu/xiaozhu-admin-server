import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    CacheService,
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
  exports: [CacheService]
})
export class CacheModule {}
