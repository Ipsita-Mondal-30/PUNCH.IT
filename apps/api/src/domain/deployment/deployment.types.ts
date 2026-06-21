import type {
  CreateDeploymentInput,
  DeploymentLogEntry,
  DeploymentSummary,
} from '@punch-it/types/deployment';

export type PrismaDeploymentStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'BUILDING'
  | 'DEPLOYING'
  | 'READY'
  | 'FAILED'
  | 'CANCELLED';

export type PrismaDeploymentTarget = 'PRODUCTION' | 'PREVIEW' | 'DEVELOPMENT';

export type DeploymentRecord = {
  id: string;
  projectId: string;
  creatorId: string;
  status: PrismaDeploymentStatus;
  target: PrismaDeploymentTarget;
  gitBranch: string | null;
  gitCommitSha: string | null;
  gitCommitMessage: string | null;
  gitAuthorName: string | null;
  gitAuthorEmail: string | null;
  url: string | null;
  readyAt: Date | null;
  buildingAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDeploymentData = {
  projectId: string;
  creatorId: string;
  target: PrismaDeploymentTarget;
  gitBranch: string;
  gitCommitSha?: string;
  gitCommitMessage?: string;
  gitAuthorName?: string;
  gitAuthorEmail?: string;
};

export type UpdateDeploymentData = {
  status?: PrismaDeploymentStatus;
  url?: string;
  readyAt?: Date;
  buildingAt?: Date;
  gitCommitSha?: string;
  gitCommitMessage?: string;
  gitAuthorName?: string;
  gitAuthorEmail?: string;
  meta?: Record<string, unknown>;
};

export interface DeploymentRepository {
  create(data: CreateDeploymentData): Promise<DeploymentRecord>;
  findById(id: string): Promise<DeploymentRecord | null>;
  findByIdForUser(id: string, userId: string): Promise<DeploymentRecord | null>;
  update(id: string, data: UpdateDeploymentData): Promise<DeploymentRecord>;
  appendLog(
    deploymentId: string,
    entry: {
      level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
      source: 'BUILD' | 'DEPLOY' | 'SYSTEM' | 'RUNTIME';
      message: string;
    },
  ): Promise<void>;
  listLogs(deploymentId: string, limit?: number): Promise<DeploymentLogEntry[]>;
}

export interface CreateDeploymentCommand extends CreateDeploymentInput {
  projectId: string;
  userId: string;
}

export interface DeploymentQueuePort {
  enqueueDeployment(deploymentId: string, projectId: string, userId: string): Promise<void>;
}

export function mapDeploymentStatus(status: PrismaDeploymentStatus): DeploymentSummary['status'] {
  switch (status) {
    case 'QUEUED':
      return 'queued';
    case 'BUILDING':
      return 'building';
    case 'DEPLOYING':
      return 'deploying';
    case 'READY':
      return 'success';
    case 'FAILED':
      return 'failed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'queued';
  }
}

export function mapDeploymentTarget(target: PrismaDeploymentTarget): DeploymentSummary['target'] {
  return target.toLowerCase() as DeploymentSummary['target'];
}

export function mapDeploymentRecord(record: DeploymentRecord): DeploymentSummary {
  return {
    id: record.id,
    projectId: record.projectId,
    status: mapDeploymentStatus(record.status),
    target: mapDeploymentTarget(record.target),
    gitBranch: record.gitBranch,
    gitCommitSha: record.gitCommitSha,
    gitCommitMessage: record.gitCommitMessage,
    url: record.url,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    readyAt: record.readyAt?.toISOString() ?? null,
    buildingAt: record.buildingAt?.toISOString() ?? null,
  };
}

export function mapDeploymentTargetInput(
  target?: CreateDeploymentInput['target'],
): PrismaDeploymentTarget {
  switch (target) {
    case 'production':
      return 'PRODUCTION';
    case 'development':
      return 'DEVELOPMENT';
    default:
      return 'PREVIEW';
  }
}
