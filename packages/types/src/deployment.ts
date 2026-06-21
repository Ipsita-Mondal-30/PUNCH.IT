export type DeploymentStatus =
  | 'queued'
  | 'building'
  | 'deploying'
  | 'success'
  | 'failed'
  | 'cancelled';

export type DeploymentTarget = 'production' | 'preview' | 'development';

export type DeploymentLogLevel = 'debug' | 'info' | 'warn' | 'error';

export type DeploymentLogSource = 'build' | 'deploy' | 'system' | 'runtime';

export type DeploymentSummary = {
  id: string;
  projectId: string;
  status: DeploymentStatus;
  target: DeploymentTarget;
  gitBranch: string | null;
  gitCommitSha: string | null;
  gitCommitMessage: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  readyAt: string | null;
  buildingAt: string | null;
};

export type DeploymentLogEntry = {
  id: string;
  level: DeploymentLogLevel;
  source: DeploymentLogSource;
  message: string;
  sequence: string;
  loggedAt: string;
};

export type CreateDeploymentInput = {
  branch?: string;
  target?: DeploymentTarget;
};

export type DeploymentJobPayload = {
  deploymentId: string;
  projectId: string;
  userId: string;
};

export type DetectedFramework =
  | 'nextjs'
  | 'vite'
  | 'react'
  | 'node'
  | 'python'
  | 'go'
  | 'static'
  | 'docker'
  | 'unknown';
