import type { FastifyInstance } from 'fastify';
import type { PaginatedResponse } from '@punch-it/types';
import type { ProjectSummary } from '@punch-it/types/github';

import { importProjectService } from '../../application/projects/import-project.service.js';
import { requireAuth } from '../plugins/auth.plugin.js';
import { createUserRateLimiter } from '../plugins/rate-limit.plugin.js';
import { importProjectBodySchema, listProjectsQuerySchema } from '../schemas/project.schemas.js';
import { validateBody, validateQuery } from '../schemas/validate.js';
import { sendServiceError } from '../utils/service-errors.js';

const importRateLimit = createUserRateLimiter({ limit: 10, windowMs: 60_000 });

type ProjectListResponse = PaginatedResponse<ProjectSummary>;
type ImportProjectResponse = { success: true; data: { project: ProjectSummary } };

export async function projectRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/',
    {
      preHandler: requireAuth,
    },
    async (request, reply): Promise<ProjectListResponse | void> => {
      const query = validateQuery(listProjectsQuerySchema, request, reply);
      if (!query) return;

      const result = await importProjectService.listProjects(
        request.auth!.user.id,
        query.page,
        query.pageSize,
      );

      return {
        success: true,
        data: {
          items: result.items,
          total: result.total,
          page: query.page,
          pageSize: query.pageSize,
          totalPages: Math.max(1, Math.ceil(result.total / query.pageSize)),
        },
      };
    },
  );

  fastify.post(
    '/import',
    {
      preHandler: [requireAuth, importRateLimit],
    },
    async (request, reply): Promise<ImportProjectResponse | void> => {
      const body = validateBody(importProjectBodySchema, request, reply);
      if (!body) return;

      try {
        const project = await importProjectService.importRepository(
          request.auth!.user.id,
          request.auth!.user.name ?? request.auth!.user.email,
          body,
        );

        reply.status(201);
        return {
          success: true,
          data: { project },
        };
      } catch (error) {
        sendServiceError(reply, error);
      }
    },
  );
}
