import type { GithubRepositorySummary } from '@punch-it/types/github';

import { githubFetch, mapGitHubRepo } from './client.js';
import type {
  GitHubApiRepo,
  GitHubSearchResponse,
  ListReposOptions,
  SearchReposOptions,
} from './types.js';

const DEFAULT_PER_PAGE = 30;
const MAX_PER_PAGE = 100;

function clampPerPage(perPage?: number): number {
  return Math.min(Math.max(perPage ?? DEFAULT_PER_PAGE, 1), MAX_PER_PAGE);
}

export async function listUserRepositories(
  accessToken: string,
  options: ListReposOptions = {},
): Promise<{ items: GithubRepositorySummary[]; rateLimitRemaining: number | null }> {
  const page = options.page ?? 1;
  const perPage = clampPerPage(options.perPage);
  const sort = options.sort ?? 'updated';
  const affiliation = options.affiliation ?? 'owner,collaborator,organization_member';

  const params = new URLSearchParams({
    sort,
    per_page: String(perPage),
    page: String(page),
    affiliation,
  });

  const { data, rateLimit } = await githubFetch<GitHubApiRepo[]>(
    accessToken,
    `/user/repos?${params.toString()}`,
  );

  return {
    items: data.map(mapGitHubRepo),
    rateLimitRemaining: rateLimit?.remaining ?? null,
  };
}

export async function searchUserRepositories(
  accessToken: string,
  query: string,
  options: SearchReposOptions = {},
): Promise<{
  items: GithubRepositorySummary[];
  total: number;
  rateLimitRemaining: number | null;
}> {
  const page = options.page ?? 1;
  const perPage = clampPerPage(options.perPage);
  const sort = options.sort ?? 'updated';

  const params = new URLSearchParams({
    q: query,
    sort,
    order: 'desc',
    per_page: String(perPage),
    page: String(page),
  });

  const { data, rateLimit } = await githubFetch<GitHubSearchResponse>(
    accessToken,
    `/search/repositories?${params.toString()}`,
  );

  return {
    items: data.items.map(mapGitHubRepo),
    total: data.total_count,
    rateLimitRemaining: rateLimit?.remaining ?? null,
  };
}

export async function getRepositoryById(
  accessToken: string,
  githubRepoId: string,
): Promise<GithubRepositorySummary> {
  const { data } = await githubFetch<GitHubApiRepo>(accessToken, `/repositories/${githubRepoId}`);
  return mapGitHubRepo(data);
}
