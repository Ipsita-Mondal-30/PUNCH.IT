import { z } from 'zod';

export const createDeploymentBodySchema = z.object({
  branch: z.string().min(1).max(255).optional(),
  target: z.enum(['production', 'preview', 'development']).optional(),
});

export const deploymentParamsSchema = z.object({
  deploymentId: z.string().uuid(),
});

export const projectDeploymentParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export const listDeploymentLogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).default(500),
});
