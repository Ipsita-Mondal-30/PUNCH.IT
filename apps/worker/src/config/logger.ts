import pino from 'pino';

import { env } from './env.js';

export const logger =
  env.NODE_ENV === 'development'
    ? pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      })
    : pino({ level: 'info' });
