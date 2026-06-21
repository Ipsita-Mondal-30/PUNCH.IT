export type DeploymentStatus =
  | 'success'
  | 'failed'
  | 'building'
  | 'deploying'
  | 'queued'
  | 'cancelled';

export type ProjectStatus = 'live' | 'building' | 'failed' | 'paused';

export type TeamRole = 'owner' | 'developer' | 'viewer';

export type DomainVerificationStatus = 'verified' | 'pending' | 'failed';

export type SslStatus = 'active' | 'pending' | 'expired';

export interface Project {
  id: string;
  name: string;
  framework: string;
  status: ProjectStatus;
  repository: string;
  branch: string;
  lastDeployment: string;
  lastDeploymentAt: string;
  domain?: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  status: DeploymentStatus;
  commit: string;
  commitMessage: string;
  branch: string;
  duration: string;
  createdAt: string;
  author: string;
}

export interface Domain {
  id: string;
  domain: string;
  projectId: string;
  projectName: string;
  verificationStatus: DomainVerificationStatus;
  sslStatus: SslStatus;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  joinedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'deployment' | 'domain' | 'team' | 'project';
  message: string;
  timestamp: string;
  status?: DeploymentStatus;
}

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  environment: 'production' | 'preview' | 'development';
}
