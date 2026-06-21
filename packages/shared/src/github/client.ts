import type { GithubRepositorySummary } from '@punch-it/types/github';

import {
  GitHubApiError,
  GitHubNotFoundError,
  GitHubRateLimitError,
  GitHubUnauthorizedError,
} from './errors.js';
import type { GitHubApiRepo, RateLimitState } from './types.js';

const GITHUB_API_BASE = 'https://api.github.com';
const USER_AGENT = 'PUNCH.IT/1.0';

const rateLimitByToken = new Map<string, RateLimitState>();

function tokenKey(accessToken: string): string {
  return accessToken.slice(-8);
}

function updateRateLimitState(accessToken: string, headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');

  if (limit && remaining && reset) {
    rateLimitByToken.set(tokenKey(accessToken), {
      limit: Number(limit),
      remaining: Number(remaining),
      resetAt: new Date(Number(reset) * 1000),
    });
  }
}

function assertNotRateLimited(accessToken: string): void {
  const state = rateLimitByToken.get(tokenKey(accessToken));
  if (!state) return;

  if (state.remaining <= 0 && state.resetAt.getTime() > Date.now()) {
    throw new GitHubRateLimitError(state.resetAt);
  }
}

export function getRateLimitState(accessToken: string): RateLimitState | null {
  return rateLimitByToken.get(tokenKey(accessToken)) ?? null;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function githubFetch<T>(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<{ data: T; rateLimit: RateLimitState | null }> {
  assertNotRateLimited(accessToken);

  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': USER_AGENT,
      ...(init?.headers ?? {}),
    },
  });

  updateRateLimitState(accessToken, response.headers);
  const rateLimit = getRateLimitState(accessToken);

  if (response.status === 401) {
    throw new GitHubUnauthorizedError(await parseErrorMessage(response));
  }

  if (response.status === 404) {
    throw new GitHubNotFoundError(await parseErrorMessage(response));
  }

  if (response.status === 403 || response.status === 429) {
    const resetHeader = response.headers.get('x-ratelimit-reset');
    if (resetHeader) {
      throw new GitHubRateLimitError(new Date(Number(resetHeader) * 1000));
    }
    throw new GitHubApiError(await parseErrorMessage(response), response.status);
  }

  if (!response.ok) {
    throw new GitHubApiError(await parseErrorMessage(response), response.status);
  }

  const data = (await response.json()) as T;
  return { data, rateLimit };
}

export function mapGitHubRepo(repo: GitHubApiRepo): GithubRepositorySummary {
  return {
    id: String(repo.id),
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    cloneUrl: repo.clone_url,
    defaultBranch: repo.default_branch,
    isPrivate: repo.private,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
    },
    updatedAt: repo.updated_at,
    language: repo.language,
    stargazersCount: repo.stargazers_count,
  };
}
