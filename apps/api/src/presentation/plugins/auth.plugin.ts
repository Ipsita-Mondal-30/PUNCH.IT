import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiErrorResponse } from '@punch-it/types';

import {
  getSessionFromRequest,
  type AuthenticatedContext,
} from '../../infrastructure/auth/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthenticatedContext;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const session = await getSessionFromRequest(request.headers);

  if (!session) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    };
    reply.status(401).send(response);
    return;
  }

  request.auth = {
    user: session.user,
    session: session.session,
  };
}

export async function optionalAuth(request: FastifyRequest): Promise<void> {
  const session = await getSessionFromRequest(request.headers);

  if (session) {
    request.auth = {
      user: session.user,
      session: session.session,
    };
  }
}
