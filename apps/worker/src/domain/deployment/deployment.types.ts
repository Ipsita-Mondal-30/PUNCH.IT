import type { DetectedFramework } from '@punch-it/types/deployment';

export type DeploymentStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'BUILDING'
  | 'DEPLOYING'
  | 'READY'
  | 'FAILED'
  | 'CANCELLED';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogSource = 'BUILD' | 'DEPLOY' | 'SYSTEM' | 'RUNTIME';

export type ProjectDeploymentContext = {
  id: string;
  name: string;
  slug: string;
  repositoryUrl: string;
  githubRepoId: string;
  defaultBranch: string;
  framework: string | null;
  rootDirectory: string | null;
  buildCommand: string | null;
  installCommand: string | null;
  outputDirectory: string | null;
  githubAccountId: string | null;
};

export type DeploymentContext = {
  id: string;
  projectId: string;
  gitBranch: string | null;
  project: ProjectDeploymentContext;
};

export type FrameworkDetectionResult = {
  framework: DetectedFramework;
  buildCommand: string | null;
  installCommand: string | null;
  outputDirectory: string | null;
  port: number;
};

export type BuildImageResult = {
  localImageTag: string;
  digest?: string;
};

export type PushImageResult = {
  remoteImageUri: string;
};

export type DeployResult = {
  serviceUrl: string;
  serviceName: string;
};

export interface DeploymentRepository {
  findContext(deploymentId: string): Promise<DeploymentContext | null>;
  updateStatus(
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
  ): Promise<void>;
  updateProjectFramework(projectId: string, framework: string): Promise<void>;
}

export interface DeploymentLogRepository {
  append(
    deploymentId: string,
    entry: {
      level: LogLevel;
      source: LogSource;
      message: string;
    },
  ): Promise<void>;
}

export interface GitCloner {
  clone(input: {
    repositoryUrl: string;
    branch: string;
    accessToken: string;
    workDir: string;
    rootDirectory: string | null;
    onOutput: (line: string) => void;
  }): Promise<{
    commitSha: string;
    commitMessage: string;
    authorName: string;
    authorEmail: string;
  }>;
}

export interface FrameworkDetector {
  detect(sourceDir: string): Promise<FrameworkDetectionResult>;
  ensureDockerfile(sourceDir: string, detection: FrameworkDetectionResult): Promise<void>;
}

export interface ContainerBuilder {
  build(input: {
    sourceDir: string;
    imageTag: string;
    onOutput: (line: string) => void;
  }): Promise<BuildImageResult>;
}

export interface ContainerRegistry {
  push(input: {
    localImageTag: string;
    remoteImageUri: string;
    onOutput: (line: string) => void;
  }): Promise<PushImageResult>;
}

export interface CloudRunDeployer {
  deploy(input: {
    serviceName: string;
    imageUri: string;
    port: number;
    onOutput: (line: string) => void;
  }): Promise<DeployResult>;
}

export interface DeploymentLogger {
  info(source: LogSource, message: string): Promise<void>;
  warn(source: LogSource, message: string): Promise<void>;
  error(source: LogSource, message: string): Promise<void>;
  debug(source: LogSource, message: string): Promise<void>;
}
