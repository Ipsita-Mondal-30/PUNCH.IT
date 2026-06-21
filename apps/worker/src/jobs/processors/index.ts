import type { Job } from 'bullmq';

import { logger } from '../../config/logger.js';
import { processDeploymentJob } from './deployment.processor.js';

export async function processBuildJob(job: Job): Promise<void> {
  logger.info({ jobId: job.id, name: job.name, data: job.data }, 'Processing build job');
}

export async function processCleanupJob(job: Job): Promise<void> {
  logger.info({ jobId: job.id, name: job.name, data: job.data }, 'Processing cleanup job');
}

export { processDeploymentJob };
