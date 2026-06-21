'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@punch-it/types';
import type {
  GithubRepositorySummary,
  ImportProjectInput,
  ProjectSummary,
} from '@punch-it/types/github';

type ReposResponse = PaginatedResponse<GithubRepositorySummary> & {
  data: PaginatedResponse<GithubRepositorySummary>['data'] & {
    rateLimitRemaining: number | null;
  };
};

type SearchReposResponse = ReposResponse;

type ProjectsResponse = PaginatedResponse<ProjectSummary>;

type ImportProjectResponse = {
  success: true;
  data: { project: ProjectSummary };
};

type UseGithubReposOptions = {
  page?: number;
  pageSize?: number;
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  enabled?: boolean;
};

type UseGithubRepoSearchOptions = {
  query: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
};

export function useGithubRepos(options: UseGithubReposOptions = {}) {
  const { page = 1, pageSize = 30, sort = 'updated', enabled = true } = options;

  return useQuery({
    queryKey: ['github', 'repos', page, pageSize, sort],
    queryFn: () =>
      apiClient<ReposResponse>('/v1/github/repos', {
        params: {
          page: String(page),
          pageSize: String(pageSize),
          sort,
        },
      }),
    enabled,
  });
}

export function useGithubRepoSearch(options: UseGithubRepoSearchOptions) {
  const { query, page = 1, pageSize = 30, enabled = true } = options;
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ['github', 'repos', 'search', trimmedQuery, page, pageSize],
    queryFn: () =>
      apiClient<SearchReposResponse>('/v1/github/repos/search', {
        params: {
          q: trimmedQuery,
          page: String(page),
          pageSize: String(pageSize),
        },
      }),
    enabled: enabled && trimmedQuery.length > 0,
  });
}

export function useProjects(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['projects', page, pageSize],
    queryFn: () =>
      apiClient<ProjectsResponse>('/v1/projects', {
        params: {
          page: String(page),
          pageSize: String(pageSize),
        },
      }),
  });
}

export function useImportProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ImportProjectInput) =>
      apiClient<ImportProjectResponse>('/v1/projects/import', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
