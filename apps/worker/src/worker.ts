import { prisma } from '@punch-it/shared/db';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initSentry } from './infrastructure/monitoring/sentry.js';
import { startWorkers, stopWorkers } from './infrastructure/queue/workers.js';

async function main() {
  initSentry();

  logger.info({ env: env.NODE_ENV }, 'Starting PUNCH.IT worker');

  startWorkers();

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down worker gracefully');
    await stopWorkers();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  logger.error(error, 'Worker failed to start');
  process.exit(1);
});
