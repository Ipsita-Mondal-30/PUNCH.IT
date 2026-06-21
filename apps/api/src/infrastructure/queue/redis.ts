import type { ConnectionOptions } from 'bullmq';
import { Redis } from 'ioredis';

import { env } from '../../config/env.js';

let redis: Redis | null = null;
let connectionOptions: ConnectionOptions | null = null;

export function getRedisConnectionOptions(): ConnectionOptions {
  if (!connectionOptions) {
    const url = new URL(env.REDIS_URL);

    connectionOptions = {
      host: url.hostname,
      port: Number(url.port) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      maxRetriesPerRequest: null,
    };
  }

  return connectionOptions;
}

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return redis;
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
