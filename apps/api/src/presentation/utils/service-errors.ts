import type { FastifyReply } from 'fastify';
import type { ApiErrorResponse } from '@punch-it/types';

import { GithubServiceError } from '../../application/github/github-repos.service.js';
import { ImportProjectError } from '../../application/projects/import-project.service.js';
import { CreateDeploymentError } from '../../application/deployments/create-deployment.service.js';

export function sendServiceError(reply: FastifyReply, error: unknown): void {
  if (
    error instanceof GithubServiceError ||
    error instanceof ImportProjectError ||
    error instanceof CreateDeploymentError
  ) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: 'details' in error ? error.details : undefined,
      },
    };

    if (error instanceof GithubServiceError && error.code === 'GITHUB_RATE_LIMITED') {
      const retryAfter =
        typeof error.details === 'object' &&
        error.details !== null &&
        'retryAfterSeconds' in error.details
          ? Number((error.details as { retryAfterSeconds: number }).retryAfterSeconds)
          : 60;
      reply.header('Retry-After', String(retryAfter));
    }

    reply.status(error.statusCode).send(response);
    return;
  }

  throw error;
}
