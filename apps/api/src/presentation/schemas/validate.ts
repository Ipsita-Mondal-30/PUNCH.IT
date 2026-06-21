import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiErrorResponse } from '@punch-it/types';
import type { z } from 'zod';

export function validateQuery<T extends z.ZodType>(
  schema: T,
  request: FastifyRequest,
  reply: FastifyReply,
): z.infer<T> | null {
  const result = schema.safeParse(request.query);

  if (!result.success) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: result.error.flatten().fieldErrors,
      },
    };
    reply.status(400).send(response);
    return null;
  }

  return result.data;
}

export function validateBody<T extends z.ZodType>(
  schema: T,
  request: FastifyRequest,
  reply: FastifyReply,
): z.infer<T> | null {
  const result = schema.safeParse(request.body);

  if (!result.success) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: result.error.flatten().fieldErrors,
      },
    };
    reply.status(400).send(response);
    return null;
  }

  return result.data;
}
