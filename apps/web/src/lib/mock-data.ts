import type { ActivityItem, Deployment, Domain, EnvVariable, Project, TeamMember } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'punchit-web',
    framework: 'Next.js',
    status: 'live',
    repository: 'acme/punchit-web',
    branch: 'main',
    lastDeployment: 'feat: add deployment pipeline',
    lastDeploymentAt: '2026-06-21T10:30:00Z',
    domain: 'punchit-web.app',
  },
  {
    id: 'proj_2',
    name: 'api-gateway',
    framework: 'Node.js',
    status: 'live',
    repository: 'acme/api-gateway',
    branch: 'main',
    lastDeployment: 'fix: rate limiting middleware',
    lastDeploymentAt: '2026-06-21T08:15:00Z',
    domain: 'api.punchit.app',
  },
  {
    id: 'proj_3',
    name: 'design-system',
    framework: 'React',
    status: 'building',
    repository: 'acme/design-system',
    branch: 'feat/tokens',
    lastDeployment: 'chore: update component tokens',
    lastDeploymentAt: '2026-06-21T11:00:00Z',
  },
  {
    id: 'proj_4',
    name: 'analytics-worker',
    framework: 'Python',
    status: 'failed',
    repository: 'acme/analytics-worker',
    branch: 'main',
    lastDeployment: 'refactor: event processing queue',
    lastDeploymentAt: '2026-06-20T22:45:00Z',
  },
  {
    id: 'proj_5',
    name: 'mobile-backend',
    framework: 'Go',
    status: 'live',
    repository: 'acme/mobile-backend',
    branch: 'main',
    lastDeployment: 'feat: push notification service',
    lastDeploymentAt: '2026-06-20T16:20:00Z',
    domain: 'mobile-api.punchit.app',
  },
  {
    id: 'proj_6',
    name: 'docs-site',
    framework: 'Astro',
    status: 'paused',
    repository: 'acme/docs-site',
    branch: 'main',
    lastDeployment: 'docs: deployment guide',
    lastDeploymentAt: '2026-06-19T14:00:00Z',
    domain: 'docs.punchit.app',
  },
];

export const mockDeployments: Deployment[] = [
  {
    id: 'dep_1',
    projectId: 'proj_1',
    projectName: 'punchit-web',
    status: 'success',
    commit: 'a3f8c21',
    commitMessage: 'feat: add deployment pipeline',
    branch: 'main',
    duration: '1m 42s',
    createdAt: '2026-06-21T10:30:00Z',
    author: 'alex.dev',
  },
  {
    id: 'dep_2',
    projectId: 'proj_2',
    projectName: 'api-gateway',
    status: 'success',
    commit: 'b7e2d09',
    commitMessage: 'fix: rate limiting middleware',
    branch: 'main',
    duration: '2m 15s',
    createdAt: '2026-06-21T08:15:00Z',
    author: 'sarah.ops',
  },
  {
    id: 'dep_3',
    projectId: 'proj_3',
    projectName: 'design-system',
    status: 'building',
    commit: 'c1a9f44',
    commitMessage: 'chore: update component tokens',
    branch: 'feat/tokens',
    duration: '—',
    createdAt: '2026-06-21T11:00:00Z',
    author: 'mike.ui',
  },
  {
    id: 'dep_4',
    projectId: 'proj_4',
    projectName: 'analytics-worker',
    status: 'failed',
    commit: 'd4b2e77',
    commitMessage: 'refactor: event processing queue',
    branch: 'main',
    duration: '3m 08s',
    createdAt: '2026-06-20T22:45:00Z',
    author: 'alex.dev',
  },
  {
    id: 'dep_5',
    projectId: 'proj_1',
    projectName: 'punchit-web',
    status: 'success',
    commit: 'e8c3a12',
    commitMessage: 'style: dashboard layout polish',
    branch: 'main',
    duration: '1m 28s',
    createdAt: '2026-06-20T18:00:00Z',
    author: 'alex.dev',
  },
  {
    id: 'dep_6',
    projectId: 'proj_5',
    projectName: 'mobile-backend',
    status: 'success',
    commit: 'f2d1b88',
    commitMessage: 'feat: push notification service',
    branch: 'main',
    duration: '4m 02s',
    createdAt: '2026-06-20T16:20:00Z',
    author: 'jordan.backend',
  },
];

export const mockDomains: Domain[] = [
  {
    id: 'dom_1',
    domain: 'punchit-web.app',
    projectId: 'proj_1',
    projectName: 'punchit-web',
    verificationStatus: 'verified',
    sslStatus: 'active',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'dom_2',
    domain: 'api.punchit.app',
    projectId: 'proj_2',
    projectName: 'api-gateway',
    verificationStatus: 'verified',
    sslStatus: 'active',
    createdAt: '2026-05-12T00:00:00Z',
  },
  {
    id: 'dom_3',
    domain: 'staging.punchit.app',
    projectId: 'proj_1',
    projectName: 'punchit-web',
    verificationStatus: 'pending',
    sslStatus: 'pending',
    createdAt: '2026-06-20T00:00:00Z',
  },
  {
    id: 'dom_4',
    domain: 'docs.punchit.app',
    projectId: 'proj_6',
    projectName: 'docs-site',
    verificationStatus: 'verified',
    sslStatus: 'active',
    createdAt: '2026-06-01T00:00:00Z',
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm_1',
    name: 'Alex Chen',
    email: 'alex@punchit.dev',
    role: 'owner',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    joinedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'tm_2',
    name: 'Sarah Kim',
    email: 'sarah@punchit.dev',
    role: 'developer',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    joinedAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'tm_3',
    name: 'Mike Torres',
    email: 'mike@punchit.dev',
    role: 'developer',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    joinedAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'tm_4',
    name: 'Jordan Lee',
    email: 'jordan@punchit.dev',
    role: 'viewer',
    joinedAt: '2026-04-05T00:00:00Z',
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'deployment',
    message: 'punchit-web deployed to production',
    timestamp: '2026-06-21T10:30:00Z',
    status: 'success',
  },
  {
    id: 'act_2',
    type: 'deployment',
    message: 'design-system build started',
    timestamp: '2026-06-21T11:00:00Z',
    status: 'building',
  },
  {
    id: 'act_3',
    type: 'domain',
    message: 'staging.punchit.app DNS verification pending',
    timestamp: '2026-06-20T14:00:00Z',
  },
  {
    id: 'act_4',
    type: 'deployment',
    message: 'analytics-worker deployment failed',
    timestamp: '2026-06-20T22:45:00Z',
    status: 'failed',
  },
  {
    id: 'act_5',
    type: 'team',
    message: 'Jordan Lee joined the team',
    timestamp: '2026-04-05T00:00:00Z',
  },
  {
    id: 'act_6',
    type: 'project',
    message: 'mobile-backend project created',
    timestamp: '2026-03-01T00:00:00Z',
  },
];

export const mockEnvVariables: EnvVariable[] = [
  { id: 'env_1', key: 'DATABASE_URL', value: '••••••••••••', environment: 'production' },
  { id: 'env_2', key: 'REDIS_URL', value: '••••••••••••', environment: 'production' },
  {
    id: 'env_3',
    key: 'NEXT_PUBLIC_API_URL',
    value: 'https://api.punchit.app',
    environment: 'production',
  },
  { id: 'env_4', key: 'GITHUB_TOKEN', value: '••••••••••••', environment: 'production' },
  { id: 'env_5', key: 'SENTRY_DSN', value: '••••••••••••', environment: 'preview' },
];

export const deploymentChartData = [
  { date: 'Mon', deployments: 12, failed: 1 },
  { date: 'Tue', deployments: 18, failed: 2 },
  { date: 'Wed', deployments: 15, failed: 0 },
  { date: 'Thu', deployments: 22, failed: 3 },
  { date: 'Fri', deployments: 28, failed: 1 },
  { date: 'Sat', deployments: 8, failed: 0 },
  { date: 'Sun', deployments: 14, failed: 1 },
];

export const deploymentLogs = [
  { time: '10:30:01', level: 'info', message: 'Cloning repository acme/punchit-web...' },
  { time: '10:30:03', level: 'info', message: 'Checked out commit a3f8c21 on branch main' },
  { time: '10:30:05', level: 'info', message: 'Detected framework: Next.js 15' },
  { time: '10:30:06', level: 'info', message: 'Installing dependencies with pnpm...' },
  { time: '10:30:45', level: 'info', message: 'Dependencies installed (39 packages)' },
  { time: '10:30:46', level: 'info', message: 'Running build command: pnpm build' },
  { time: '10:31:12', level: 'info', message: '▲ Next.js 15.1.2' },
  { time: '10:31:12', level: 'info', message: 'Creating an optimized production build...' },
  { time: '10:31:38', level: 'info', message: 'Compiled successfully in 26.2s' },
  { time: '10:31:39', level: 'info', message: 'Collecting page data...' },
  { time: '10:31:42', level: 'info', message: 'Generating static pages (8/8)' },
  { time: '10:31:43', level: 'success', message: 'Build completed successfully' },
  { time: '10:31:44', level: 'info', message: 'Uploading build artifacts...' },
  { time: '10:31:50', level: 'info', message: 'Deploying to edge network...' },
  { time: '10:31:58', level: 'info', message: 'Assigning domain punchit-web.app...' },
  { time: '10:32:01', level: 'success', message: 'Deployment ready — https://punchit-web.app' },
];

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getDeploymentsByProjectId(projectId: string): Deployment[] {
  return mockDeployments.filter((d) => d.projectId === projectId);
}

export function getDeploymentById(id: string): Deployment | undefined {
  return mockDeployments.find((d) => d.id === id);
}
