import { env } from './config/env.js';
import { buildApp } from './app.js';
import { disconnectRedis } from './infrastructure/queue/redis.js';
import { prisma } from './infrastructure/database/index.js';

async function main() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Shutting down gracefully');
    await app.close();
    await disconnectRedis();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await app.listen({ port: env.API_PORT, host: env.API_HOST });
    app.log.info(`API server listening on ${env.API_HOST}:${env.API_PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
