import { prisma } from '@punch-it/shared/db';
import type { DeploymentLogEntry } from '@punch-it/types/deployment';

import type {
  CreateDeploymentData,
  DeploymentRecord,
  DeploymentRepository,
  UpdateDeploymentData,
} from '../../domain/deployment/index.js';

const deploymentSelect = {
  id: true,
  projectId: true,
  creatorId: true,
  status: true,
  target: true,
  gitBranch: true,
  gitCommitSha: true,
  gitCommitMessage: true,
  gitAuthorName: true,
  gitAuthorEmail: true,
  url: true,
  readyAt: true,
  buildingAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function mapLogEntry(log: {
  id: string;
  level: string;
  source: string;
  message: string;
  sequence: bigint;
  loggedAt: Date;
}): DeploymentLogEntry {
  return {
    id: log.id,
    level: log.level.toLowerCase() as DeploymentLogEntry['level'],
    source: log.source.toLowerCase() as DeploymentLogEntry['source'],
    message: log.message,
    sequence: log.sequence.toString(),
    loggedAt: log.loggedAt.toISOString(),
  };
}

export class PrismaDeploymentRepository implements DeploymentRepository {
  async create(data: CreateDeploymentData): Promise<DeploymentRecord> {
    return prisma.deployment.create({
      data: {
        projectId: data.projectId,
        creatorId: data.creatorId,
        status: 'QUEUED',
        target: data.target,
        gitBranch: data.gitBranch,
        gitCommitSha: data.gitCommitSha,
        gitCommitMessage: data.gitCommitMessage,
        gitAuthorName: data.gitAuthorName,
        gitAuthorEmail: data.gitAuthorEmail,
      },
      select: deploymentSelect,
    });
  }

  async findById(id: string): Promise<DeploymentRecord | null> {
    return prisma.deployment.findFirst({
      where: { id, deletedAt: null },
      select: deploymentSelect,
    });
  }

  async findByIdForUser(id: string, userId: string): Promise<DeploymentRecord | null> {
    return prisma.deployment.findFirst({
      where: {
        id,
        deletedAt: null,
        project: {
          deletedAt: null,
          team: {
            deletedAt: null,
            members: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        },
      },
      select: deploymentSelect,
    });
  }

  async update(id: string, data: UpdateDeploymentData): Promise<DeploymentRecord> {
    return prisma.deployment.update({
      where: { id },
      data: {
        status: data.status,
        url: data.url,
        readyAt: data.readyAt,
        buildingAt: data.buildingAt,
        gitCommitSha: data.gitCommitSha,
        gitCommitMessage: data.gitCommitMessage,
        gitAuthorName: data.gitAuthorName,
        gitAuthorEmail: data.gitAuthorEmail,
        meta: data.meta as Parameters<typeof prisma.deployment.update>[0]['data']['meta'],
      },
      select: deploymentSelect,
    });
  }

  async appendLog(
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

  async listLogs(deploymentId: string, limit = 500): Promise<DeploymentLogEntry[]> {
    const logs = await prisma.deploymentLog.findMany({
      where: { deploymentId },
      orderBy: { sequence: 'asc' },
      take: limit,
      select: {
        id: true,
        level: true,
        source: true,
        message: true,
        sequence: true,
        loggedAt: true,
      },
    });

    return logs.map(mapLogEntry);
  }
}

export const deploymentRepository = new PrismaDeploymentRepository();
