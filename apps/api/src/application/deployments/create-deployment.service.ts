import { getDecryptedGithubAccessToken } from '@punch-it/shared/auth/github';
import type { DeploymentSummary } from '@punch-it/types/deployment';

import {
  mapDeploymentRecord,
  mapDeploymentTargetInput,
  type CreateDeploymentCommand,
} from '../../domain/deployment/index.js';
import { deploymentRepository } from '../../infrastructure/repositories/deployment.repository.js';
import { deploymentQueueService } from '../../infrastructure/queue/deployment-queue.service.js';
import { projectRepository } from '../../infrastructure/repositories/project.repository.js';

export class CreateDeploymentError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = 'CreateDeploymentError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class CreateDeploymentService {
  async createDeployment(command: CreateDeploymentCommand): Promise<DeploymentSummary> {
    const project = await projectRepository.findAccessibleProject(
      command.userId,
      command.projectId,
    );

    if (!project) {
      throw new CreateDeploymentError(
        'PROJECT_NOT_FOUND',
        'Project not found or access denied.',
        404,
      );
    }

    if (!project.repositoryUrl || !project.githubRepoId) {
      throw new CreateDeploymentError(
        'REPOSITORY_NOT_LINKED',
        'Project does not have a linked GitHub repository.',
        400,
      );
    }

    if (!project.githubAccountId) {
      throw new CreateDeploymentError(
        'GITHUB_NOT_LINKED',
        'Project is missing a linked GitHub account.',
        400,
      );
    }

    const accessToken = await getDecryptedGithubAccessToken(command.userId);
    if (!accessToken) {
      throw new CreateDeploymentError(
        'GITHUB_TOKEN_INVALID',
        'GitHub access token is missing or expired. Sign in again with GitHub.',
        401,
      );
    }

    const branch = command.branch ?? project.defaultBranch;

    const deployment = await deploymentRepository.create({
      projectId: project.id,
      creatorId: command.userId,
      target: mapDeploymentTargetInput(command.target),
      gitBranch: branch,
    });

    await deploymentQueueService.enqueueDeployment(deployment.id, project.id, command.userId);

    return mapDeploymentRecord(deployment);
  }

  async getDeployment(userId: string, deploymentId: string): Promise<DeploymentSummary | null> {
    const deployment = await deploymentRepository.findByIdForUser(deploymentId, userId);
    return deployment ? mapDeploymentRecord(deployment) : null;
  }

  async getDeploymentLogs(userId: string, deploymentId: string) {
    const deployment = await deploymentRepository.findByIdForUser(deploymentId, userId);
    if (!deployment) {
      return null;
    }

    return deploymentRepository.listLogs(deploymentId);
  }
}

export const createDeploymentService = new CreateDeploymentService();
