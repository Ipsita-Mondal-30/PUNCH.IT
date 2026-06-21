import type { Job } from 'bullmq';
import { Worker } from 'bullmq';

import { JOB_NAMES, QUEUE_NAMES } from '@punch-it/shared/constants';

import { logger } from '../../config/logger.js';
import { getRedisConnectionOptions } from './connection.js';
import {
  processBuildJob,
  processCleanupJob,
  processDeploymentJob,
} from '../../jobs/processors/index.js';

type WorkerInstance = Worker;

const workers: WorkerInstance[] = [];

function createWorker(queueName: string, processor: (job: Job) => Promise<void>): WorkerInstance {
  const worker = new Worker(queueName, processor, {
    connection: getRedisConnectionOptions(),
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: queueName }, 'Job completed');
  });

  worker.on('failed', (job, error) => {
    logger.error({ jobId: job?.id, queue: queueName, error: error.message }, 'Job failed');
  });

  workers.push(worker);
  return worker;
}

export function startWorkers(): void {
  createWorker(QUEUE_NAMES.DEPLOYMENT, async (job) => {
    switch (job.name) {
      case JOB_NAMES.PROCESS_DEPLOYMENT:
        await processDeploymentJob(job);
        break;
      default:
        logger.warn({ jobName: job.name }, 'Unknown deployment job');
    }
  });

  createWorker(QUEUE_NAMES.BUILD, async (job) => {
    switch (job.name) {
      case JOB_NAMES.RUN_BUILD:
      case JOB_NAMES.UPLOAD_ARTIFACTS:
        await processBuildJob(job);
        break;
      default:
        logger.warn({ jobName: job.name }, 'Unknown build job');
    }
  });

  createWorker(QUEUE_NAMES.CLEANUP, async (job) => {
    switch (job.name) {
      case JOB_NAMES.CLEANUP_OLD_BUILDS:
        await processCleanupJob(job);
        break;
      default:
        logger.warn({ jobName: job.name }, 'Unknown cleanup job');
    }
  });

  logger.info('All workers started');
}

export async function stopWorkers(): Promise<void> {
  await Promise.all(workers.map((worker) => worker.close()));
  workers.length = 0;
  logger.info('All workers stopped');
}
