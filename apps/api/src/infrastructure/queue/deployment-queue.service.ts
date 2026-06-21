import { JOB_NAMES } from '@punch-it/shared/constants';
import type { DeploymentJobPayload } from '@punch-it/types/deployment';

import type { DeploymentQueuePort } from '../../domain/deployment/index.js';
import { deploymentQueue } from '../queue/queues.js';

export class BullMQDeploymentQueue implements DeploymentQueuePort {
  async enqueueDeployment(deploymentId: string, projectId: string, userId: string): Promise<void> {
    const payload: DeploymentJobPayload = {
      deploymentId,
      projectId,
      userId,
    };

    await deploymentQueue.add(JOB_NAMES.PROCESS_DEPLOYMENT, payload, {
      jobId: deploymentId,
    });
  }
}

export const deploymentQueueService = new BullMQDeploymentQueue();
