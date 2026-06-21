import {
  getDecryptedGithubAccessToken,
  getGithubAccountForUser,
} from '@punch-it/shared/auth/github';
import {
  getRepositoryById,
  GitHubApiError as GitHubClientError,
  GitHubRateLimitError,
  GitHubUnauthorizedError,
  listUserRepositories,
  searchUserRepositories,
} from '@punch-it/shared/github';
import type { GithubRepositorySummary } from '@punch-it/types/github';

export class GithubServiceError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(code: string, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'GithubServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function getAccessTokenForUser(userId: string): Promise<string> {
  const account = await getGithubAccountForUser(userId);
  if (!account) {
    throw new GithubServiceError(
      'GITHUB_NOT_LINKED',
      'No linked GitHub account. Sign in with GitHub first.',
      400,
    );
  }

  const token = await getDecryptedGithubAccessToken(userId);
  if (!token) {
    throw new GithubServiceError(
      'GITHUB_TOKEN_INVALID',
      'GitHub access token is missing or expired. Sign in again with GitHub.',
      401,
    );
  }

  return token;
}

function mapGithubError(error: unknown): never {
  if (error instanceof GitHubRateLimitError) {
    throw new GithubServiceError('GITHUB_RATE_LIMITED', error.message, 429, {
      resetAt: error.resetAt.toISOString(),
      retryAfterSeconds: error.retryAfterSeconds,
    });
  }

  if (error instanceof GitHubUnauthorizedError) {
    throw new GithubServiceError('GITHUB_UNAUTHORIZED', error.message, 401);
  }

  if (error instanceof GitHubClientError) {
    throw new GithubServiceError('GITHUB_API_ERROR', error.message, error.status);
  }

  throw error;
}

export class GithubReposService {
  async listRepositories(
    userId: string,
    options: {
      page: number;
      pageSize: number;
      sort: 'created' | 'updated' | 'pushed' | 'full_name';
    },
  ): Promise<{ items: GithubRepositorySummary[]; rateLimitRemaining: number | null }> {
    try {
      const accessToken = await getAccessTokenForUser(userId);
      return await listUserRepositories(accessToken, {
        page: options.page,
        perPage: options.pageSize,
        sort: options.sort,
      });
    } catch (error) {
      mapGithubError(error);
    }
  }

  async searchRepositories(
    userId: string,
    options: {
      query: string;
      page: number;
      pageSize: number;
      sort: 'stars' | 'forks' | 'updated';
    },
  ): Promise<{
    items: GithubRepositorySummary[];
    total: number;
    rateLimitRemaining: number | null;
  }> {
    try {
      const accessToken = await getAccessTokenForUser(userId);
      const account = await getGithubAccountForUser(userId);
      const scopedQuery = account ? `${options.query} user:${account.login}` : options.query;

      return await searchUserRepositories(accessToken, scopedQuery, {
        page: options.page,
        perPage: options.pageSize,
        sort: options.sort,
      });
    } catch (error) {
      mapGithubError(error);
    }
  }

  async getRepository(userId: string, githubRepoId: string): Promise<GithubRepositorySummary> {
    try {
      const accessToken = await getAccessTokenForUser(userId);
      return await getRepositoryById(accessToken, githubRepoId);
    } catch (error) {
      mapGithubError(error);
    }
  }
}

export const githubReposService = new GithubReposService();
