import { prisma } from '@punch-it/shared/db';

import type {
  DeploymentContext,
  DeploymentLogRepository,
  DeploymentRepository,
  DeploymentStatus,
} from '../../domain/deployment/index.js';

export class PrismaDeploymentRepository implements DeploymentRepository {
  async findContext(deploymentId: string): Promise<DeploymentContext | null> {
    const deployment = await prisma.deployment.findFirst({
      where: { id: deploymentId, deletedAt: null },
      select: {
        id: true,
        projectId: true,
        gitBranch: true,
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            repositoryUrl: true,
            githubRepoId: true,
            defaultBranch: true,
            framework: true,
            rootDirectory: true,
            buildCommand: true,
            installCommand: true,
            outputDirectory: true,
            githubAccountId: true,
          },
        },
      },
    });

    if (!deployment?.project.repositoryUrl) {
      return null;
    }

    return {
      id: deployment.id,
      projectId: deployment.projectId,
      gitBranch: deployment.gitBranch,
      project: {
        ...deployment.project,
        repositoryUrl: deployment.project.repositoryUrl,
        githubRepoId: deployment.project.githubRepoId ?? '',
      },
    };
  }

  async updateStatus(
    deploymentId: string,
    status: DeploymentStatus,
    fields?: {
      url?: string;
      readyAt?: Date;
      buildingAt?: Date;
      gitCommitSha?: string;
      gitCommitMessage?: string;
      gitAuthorName?: string;
      gitAuthorEmail?: string;
      meta?: Record<string, unknown>;
    },
  ): Promise<void> {
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status,
        url: fields?.url,
        readyAt: fields?.readyAt,
        buildingAt: fields?.buildingAt,
        gitCommitSha: fields?.gitCommitSha,
        gitCommitMessage: fields?.gitCommitMessage,
        gitAuthorName: fields?.gitAuthorName,
        gitAuthorEmail: fields?.gitAuthorEmail,
        meta: fields?.meta as Parameters<typeof prisma.deployment.update>[0]['data']['meta'],
      },
    });
  }

  async updateProjectFramework(projectId: string, framework: string): Promise<void> {
    await prisma.project.update({
      where: { id: projectId },
      data: { framework },
    });
  }
}

export class PrismaDeploymentLogRepository implements DeploymentLogRepository {
  async append(
    deploymentId: string,
    entry: {
      level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
      source: 'BUILD' | 'DEPLOY' | 'SYSTEM' | 'RUNTIME';
      message: string;
    },
  ): Promise<void> {
    const latest = await prisma.deploymentLog.findFirst({
      where: { deploymentId },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    });

    const sequence = latest ? latest.sequence + BigInt(1) : BigInt(1);

    await prisma.deploymentLog.create({
      data: {
        deploymentId,
        level: entry.level,
        source: entry.source,
        message: entry.message,
        sequence,
      },
    });
  }
}

export const deploymentRepository = new PrismaDeploymentRepository();
export const deploymentLogRepository = new PrismaDeploymentLogRepository();
