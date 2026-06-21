import type { FastifyInstance } from 'fastify';

import { deploymentDetailRoutes, projectDeploymentRoutes } from './deployment.routes.js';
import { githubRoutes } from './github.routes.js';
import { projectRoutes } from './project.routes.js';

export async function v1Routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/v1', async () => ({
    name: 'PUNCH.IT API',
    version: 'v1',
    status: 'operational',
  }));

  await fastify.register(githubRoutes, { prefix: '/v1/github' });
  await fastify.register(projectRoutes, { prefix: '/v1/projects' });
  await fastify.register(projectDeploymentRoutes, { prefix: '/v1/projects' });
  await fastify.register(deploymentDetailRoutes, { prefix: '/v1/deployments' });
}
