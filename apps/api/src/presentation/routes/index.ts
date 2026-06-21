import type { FastifyInstance } from 'fastify';

import { authRoutes } from './auth.routes.js';
import { healthRoutes } from './health.routes.js';
import { v1Routes } from './v1.routes.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(healthRoutes);
  await fastify.register(v1Routes);
  await fastify.register(authRoutes, { prefix: '/v1/auth' });
}
