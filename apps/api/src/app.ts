import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import Fastify from 'fastify';

import { corsConfig, serverConfig } from './config/index.js';
import { initSentry } from './infrastructure/monitoring/sentry.js';
import { errorHandler } from './presentation/plugins/error-handler.js';
import { registerRoutes } from './presentation/routes/index.js';

export async function buildApp() {
  initSentry();

  const app = Fastify(serverConfig);

  await app.register(cors, corsConfig);
  await app.register(helmet);
  await app.register(sensible);

  app.setErrorHandler(errorHandler);

  await registerRoutes(app);

  return app;
}
