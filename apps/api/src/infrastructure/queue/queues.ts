import { Queue } from 'bullmq';

import { JOB_NAMES, QUEUE_NAMES } from '@punch-it/shared/constants';

import { getRedisConnectionOptions } from './redis.js';

const connection = getRedisConnectionOptions();

export const deploymentQueue = new Queue(QUEUE_NAMES.DEPLOYMENT, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

export const buildQueue = new Queue(QUEUE_NAMES.BUILD, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export { JOB_NAMES, QUEUE_NAMES };
