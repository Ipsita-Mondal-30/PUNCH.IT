import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { getDecryptedGithubAccessTokenByAccountId } from '@punch-it/shared/auth/github';
import type { DeploymentJobPayload } from '@punch-it/types/deployment';

import { env } from '../../config/env.js';
import type {
  CloudRunDeployer,
  ContainerBuilder,
  ContainerRegistry,
  DeploymentLogRepository,
  DeploymentRepository,
  FrameworkDetector,
  GitCloner,
} from '../../domain/deployment/index.js';
import { createDeploymentLogger } from '../../infrastructure/logging/deployment-logger.js';

export class ProcessDeploymentUseCase {
  constructor(
    private readonly deploymentRepository: DeploymentRepository,
    private readonly logRepository: DeploymentLogRepository,
    private readonly gitCloner: GitCloner,
    private readonly frameworkDetector: FrameworkDetector,
    private readonly containerBuilder: ContainerBuilder,
    private readonly containerRegistry: ContainerRegistry,
    private readonly cloudRunDeployer: CloudRunDeployer,
  ) {}

  async execute(payload: DeploymentJobPayload): Promise<void> {
    const context = await this.deploymentRepository.findContext(payload.deploymentId);
    if (!context) {
      throw new Error(`Deployment context not found: ${payload.deploymentId}`);
    }

    const logger = createDeploymentLogger(payload.deploymentId, this.logRepository);
    let workDir: string | null = null;

    try {
      await logger.info('SYSTEM', 'Deployment job started');
      await this.deploymentRepository.updateStatus(payload.deploymentId, 'BUILDING', {
        buildingAt: new Date(),
      });

      if (!context.project.githubAccountId) {
        throw new Error('Project is missing a linked GitHub account');
      }

      const accessToken = await getDecryptedGithubAccessTokenByAccountId(
        context.project.githubAccountId,
      );
      if (!accessToken) {
        throw new Error('GitHub access token is missing or expired');
      }

      workDir = await mkdtemp(join(tmpdir(), `punchit-deploy-${payload.deploymentId}-`));
      const branch = context.gitBranch ?? context.project.defaultBranch;

      const cloneResult = await this.gitCloner.clone({
        repositoryUrl: context.project.repositoryUrl,
        branch,
        accessToken,
        workDir,
        rootDirectory: context.project.rootDirectory,
        onOutput: (line) => {
          void logger.info('BUILD', line);
        },
      });

      await this.deploymentRepository.updateStatus(payload.deploymentId, 'BUILDING', {
        gitCommitSha: cloneResult.commitSha,
        gitCommitMessage: cloneResult.commitMessage,
        gitAuthorName: cloneResult.authorName,
        gitAuthorEmail: cloneResult.authorEmail,
      });

      const sourceDir = context.project.rootDirectory
        ? join(workDir, context.project.rootDirectory)
        : workDir;

      await logger.info('BUILD', 'Detecting framework');
      const detection = await this.frameworkDetector.detect(sourceDir);
      await logger.info('BUILD', `Detected framework: ${detection.framework}`);

      await this.frameworkDetector.ensureDockerfile(sourceDir, detection);
      await this.deploymentRepository.updateProjectFramework(
        context.projectId,
        detection.framework,
      );

      const localImageTag = `punchit/${context.project.slug}:${payload.deploymentId}`;
      await this.containerBuilder.build({
        sourceDir,
        imageTag: localImageTag,
        onOutput: (line) => {
          void logger.info('BUILD', line);
        },
      });

      await this.deploymentRepository.updateStatus(payload.deploymentId, 'DEPLOYING');
      await logger.info('DEPLOY', 'Build completed, starting deployment');

      const remoteImageUri = `${env.GCP_ARTIFACT_REGISTRY}/${context.project.slug}:${payload.deploymentId}`;
      await this.containerRegistry.push({
        localImageTag,
        remoteImageUri,
        onOutput: (line) => {
          void logger.info('DEPLOY', line);
        },
      });

      const serviceName = `${env.GCP_CLOUD_RUN_SERVICE_PREFIX}${context.project.slug}`.slice(0, 63);
      const deployResult = await this.cloudRunDeployer.deploy({
        serviceName,
        imageUri: remoteImageUri,
        port: detection.port,
        onOutput: (line) => {
          void logger.info('DEPLOY', line);
        },
      });

      await this.deploymentRepository.updateStatus(payload.deploymentId, 'READY', {
        url: deployResult.serviceUrl,
        readyAt: new Date(),
        meta: {
          serviceName: deployResult.serviceName,
          imageUri: remoteImageUri,
          framework: detection.framework,
        },
      });

      await logger.info('SYSTEM', `Deployment succeeded: ${deployResult.serviceUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown deployment error';
      await logger.error('SYSTEM', `Deployment failed: ${message}`);
      await this.deploymentRepository.updateStatus(payload.deploymentId, 'FAILED');
      throw error;
    } finally {
      if (workDir) {
        await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
      }
    }
  }
}
