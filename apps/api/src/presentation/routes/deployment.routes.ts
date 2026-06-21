import type { FastifyInstance } from 'fastify';
import type { ApiResponse } from '@punch-it/types';
import type { DeploymentLogEntry, DeploymentSummary } from '@punch-it/types/deployment';

import { createDeploymentService } from '../../application/deployments/create-deployment.service.js';
import { requireAuth } from '../plugins/auth.plugin.js';
import { createUserRateLimiter } from '../plugins/rate-limit.plugin.js';
import {
  createDeploymentBodySchema,
  deploymentParamsSchema,
  listDeploymentLogsQuerySchema,
  projectDeploymentParamsSchema,
} from '../schemas/deployment.schemas.js';
import { validateBody, validateQuery } from '../schemas/validate.js';
import { sendServiceError } from '../utils/service-errors.js';

const deployRateLimit = createUserRateLimiter({ limit: 20, windowMs: 60_000 });

type CreateDeploymentResponse = ApiResponse<{ deployment: DeploymentSummary }>;
type GetDeploymentResponse = ApiResponse<{ deployment: DeploymentSummary }>;
type GetDeploymentLogsResponse = ApiResponse<{ logs: DeploymentLogEntry[] }>;

export async function projectDeploymentRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/:projectId/deployments',
    {
      preHandler: [requireAuth, deployRateLimit],
    },
    async (request, reply): Promise<CreateDeploymentResponse | void> => {
      const params = projectDeploymentParamsSchema.safeParse(request.params);
      if (!params.success) {
        reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        });
        return;
      }

      const body = validateBody(createDeploymentBodySchema, request, reply);
      if (!body) return;

      try {
        const deployment = await createDeploymentService.createDeployment({
          projectId: params.data.projectId,
          userId: request.auth!.user.id,
          branch: body.branch,
          target: body.target,
        });

        reply.status(201);
        return {
          success: true,
          data: { deployment },
        };
      } catch (error) {
        sendServiceError(reply, error);
      }
    },
  );
}

export async function deploymentDetailRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/:deploymentId',
    {
      preHandler: requireAuth,
    },
    async (request, reply): Promise<GetDeploymentResponse | void> => {
      const params = deploymentParamsSchema.safeParse(request.params);
      if (!params.success) {
        reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid deployment ID',
          },
        });
        return;
      }

      const deployment = await createDeploymentService.getDeployment(
        request.auth!.user.id,
        params.data.deploymentId,
      );

      if (!deployment) {
        reply.status(404).send({
          success: false,
          error: {
            code: 'DEPLOYMENT_NOT_FOUND',
            message: 'Deployment not found or access denied.',
          },
        });
        return;
      }

      return {
        success: true,
        data: { deployment },
      };
    },
  );

  fastify.get(
    '/:deploymentId/logs',
    {
      preHandler: requireAuth,
    },
    async (request, reply): Promise<GetDeploymentLogsResponse | void> => {
      const params = deploymentParamsSchema.safeParse(request.params);
      if (!params.success) {
        reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid deployment ID',
          },
        });
        return;
      }

      const query = validateQuery(listDeploymentLogsQuerySchema, request, reply);
      if (!query) return;

      const logs = await createDeploymentService.getDeploymentLogs(
        request.auth!.user.id,
        params.data.deploymentId,
      );

      if (!logs) {
        reply.status(404).send({
          success: false,
          error: {
            code: 'DEPLOYMENT_NOT_FOUND',
            message: 'Deployment not found or access denied.',
          },
        });
        return;
      }

      return {
        success: true,
        data: { logs },
      };
    },
  );
}
