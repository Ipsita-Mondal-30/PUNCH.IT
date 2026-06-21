import type { FastifyServerOptions } from 'fastify';

import { env } from './env.js';

export const loggerConfig: FastifyServerOptions['logger'] =
  env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: 'info',
      };

export const serverConfig: FastifyServerOptions = {
  logger: loggerConfig,
};

export const corsConfig = {
  origin:
    env.NODE_ENV === 'production'
      ? [env.BETTER_AUTH_URL]
      : [env.BETTER_AUTH_URL, 'http://localhost:3000'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
