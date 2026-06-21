export class GitHubApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = 'GITHUB_API_ERROR') {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.code = code;
  }
}

export class GitHubRateLimitError extends GitHubApiError {
  readonly resetAt: Date;
  readonly retryAfterSeconds: number;

  constructor(resetAt: Date) {
    const retryAfterSeconds = Math.max(0, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
    super(
      `GitHub API rate limit exceeded. Retry after ${retryAfterSeconds} seconds.`,
      429,
      'GITHUB_RATE_LIMITED',
    );
    this.name = 'GitHubRateLimitError';
    this.resetAt = resetAt;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class GitHubNotFoundError extends GitHubApiError {
  constructor(message = 'GitHub resource not found') {
    super(message, 404, 'GITHUB_NOT_FOUND');
    this.name = 'GitHubNotFoundError';
  }
}

export class GitHubUnauthorizedError extends GitHubApiError {
  constructor(message = 'GitHub token is invalid or expired') {
    super(message, 401, 'GITHUB_UNAUTHORIZED');
    this.name = 'GitHubUnauthorizedError';
  }
}
