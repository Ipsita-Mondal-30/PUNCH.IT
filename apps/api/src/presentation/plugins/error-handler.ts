import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import type { ApiErrorResponse } from '@punch-it/types';

import { Sentry } from '../../infrastructure/monitoring/sentry.js';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  request.log.error(error);

  Sentry.captureException(error, {
    extra: {
      url: request.url,
      method: request.method,
    },
  });

  const statusCode = error.statusCode ?? 500;
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_ERROR',
      message: statusCode >= 500 ? 'Internal server error' : error.message,
    },
  };

  reply.status(statusCode).send(response);
}
