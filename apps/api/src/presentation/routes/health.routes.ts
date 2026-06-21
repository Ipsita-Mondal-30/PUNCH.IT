import type { FastifyInstance } from 'fastify';
import type { HealthCheckResponse } from '@punch-it/types';

import { checkDatabaseConnection } from '../../infrastructure/database/index.js';
import { getRedis } from '../../infrastructure/queue/redis.js';

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (): Promise<HealthCheckResponse> => {
    const [databaseUp, redisUp] = await Promise.all([
      checkDatabaseConnection(),
      checkRedisConnection(),
    ]);

    const allUp = databaseUp && redisUp;

    return {
      status: allUp ? 'ok' : databaseUp || redisUp ? 'degraded' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: databaseUp ? 'up' : 'down',
        redis: redisUp ? 'up' : 'down',
      },
    };
  });

  fastify.get('/health/live', async () => ({ status: 'ok' }));
  fastify.get('/health/ready', async (_request, reply) => {
    const dbUp = await checkDatabaseConnection();
    if (!dbUp) {
      return reply.status(503).send({ status: 'not ready' });
    }
    return { status: 'ready' };
  });
}

async function checkRedisConnection(): Promise<boolean> {
  try {
    const redis = getRedis();
    const result = await redis.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}
