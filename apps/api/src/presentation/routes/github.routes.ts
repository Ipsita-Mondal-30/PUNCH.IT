import type { FastifyInstance } from 'fastify';
import type { PaginatedResponse } from '@punch-it/types';
import type { GithubRepositorySummary } from '@punch-it/types/github';

import { githubReposService } from '../../application/github/github-repos.service.js';
import { requireAuth } from '../plugins/auth.plugin.js';
import { githubApiRateLimit } from '../plugins/rate-limit.plugin.js';
import {
  listGithubReposQuerySchema,
  searchGithubReposQuerySchema,
} from '../schemas/github.schemas.js';
import { validateQuery } from '../schemas/validate.js';
import { sendServiceError } from '../utils/service-errors.js';

type ReposListResponse = PaginatedResponse<GithubRepositorySummary> & {
  data: PaginatedResponse<GithubRepositorySummary>['data'] & {
    rateLimitRemaining: number | null;
  };
};

export async function githubRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/repos',
    {
      preHandler: [requireAuth, githubApiRateLimit],
    },
    async (request, reply): Promise<ReposListResponse | void> => {
      const query = validateQuery(listGithubReposQuerySchema, request, reply);
      if (!query) return;

      try {
        const result = await githubReposService.listRepositories(request.auth!.user.id, {
          page: query.page,
          pageSize: query.pageSize,
          sort: query.sort,
        });

        return {
          success: true,
          data: {
            items: result.items,
            total: result.items.length,
            page: query.page,
            pageSize: query.pageSize,
            totalPages: result.items.length < query.pageSize ? query.page : query.page + 1,
            rateLimitRemaining: result.rateLimitRemaining,
          },
        };
      } catch (error) {
        sendServiceError(reply, error);
      }
    },
  );

  fastify.get(
    '/repos/search',
    {
      preHandler: [requireAuth, githubApiRateLimit],
    },
    async (request, reply) => {
      const query = validateQuery(searchGithubReposQuerySchema, request, reply);
      if (!query) return;

      try {
        const result = await githubReposService.searchRepositories(request.auth!.user.id, {
          query: query.q,
          page: query.page,
          pageSize: query.pageSize,
          sort: query.sort,
        });

        return {
          success: true,
          data: {
            items: result.items,
            total: result.total,
            page: query.page,
            pageSize: query.pageSize,
            totalPages: Math.max(1, Math.ceil(result.total / query.pageSize)),
            rateLimitRemaining: result.rateLimitRemaining,
          },
        };
      } catch (error) {
        sendServiceError(reply, error);
      }
    },
  );
}
