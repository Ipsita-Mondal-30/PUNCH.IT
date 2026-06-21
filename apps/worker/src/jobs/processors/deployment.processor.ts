import type { Job } from 'bullmq';
import type { DeploymentJobPayload } from '@punch-it/types/deployment';

import { ProcessDeploymentUseCase } from '../../application/deployment/process-deployment.use-case.js';
import { containerBuilder } from '../../infrastructure/docker/docker-builder.js';
import { frameworkDetector } from '../../infrastructure/detection/framework-detector.js';
import { containerRegistry } from '../../infrastructure/gcp/artifact-registry.js';
import { cloudRunDeployer } from '../../infrastructure/gcp/cloud-run-deployer.js';
import { gitCloner } from '../../infrastructure/github/git-cloner.js';
import {
  deploymentLogRepository,
  deploymentRepository,
} from '../../infrastructure/repositories/deployment.repository.js';
import { logger } from '../../config/logger.js';

const processDeploymentUseCase = new ProcessDeploymentUseCase(
  deploymentRepository,
  deploymentLogRepository,
  gitCloner,
  frameworkDetector,
  containerBuilder,
  containerRegistry,
  cloudRunDeployer,
);

export async function processDeploymentJob(job: Job<DeploymentJobPayload>): Promise<void> {
  logger.info({ jobId: job.id, deploymentId: job.data.deploymentId }, 'Processing deployment job');
  await processDeploymentUseCase.execute(job.data);
}
