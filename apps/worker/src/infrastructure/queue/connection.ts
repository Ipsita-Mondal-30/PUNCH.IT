import type { ConnectionOptions } from 'bullmq';

import { env } from '../../config/env.js';

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
