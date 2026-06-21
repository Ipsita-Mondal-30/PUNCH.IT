export type ApiResponse<T = unknown> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>;

export type DeploymentStatus =
  | 'queued'
  | 'building'
  | 'deploying'
  | 'success'
  | 'failed'
  | 'cancelled';

export type BuildStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export type Environment = 'development' | 'preview' | 'production';

export type HealthCheckResponse = {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
  };
};

export * from './github.js';
export * from './deployment.js';
