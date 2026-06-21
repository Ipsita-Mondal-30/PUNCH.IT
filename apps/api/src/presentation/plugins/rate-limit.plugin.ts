import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiErrorResponse } from '@punch-it/types';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60_000;

export function createUserRateLimiter(options?: { limit?: number; windowMs?: number }) {
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;

  return async function rateLimitByUser(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const userId = request.auth?.user.id;
    if (!userId) return;

    const now = Date.now();
    const bucket = buckets.get(userId);

    if (!bucket || now >= bucket.resetAt) {
      buckets.set(userId, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (bucket.count >= limit) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Retry after ${retryAfterSeconds} seconds.`,
          details: { retryAfterSeconds },
        },
      };
      reply.header('Retry-After', String(retryAfterSeconds));
      reply.status(429).send(response);
      return;
    }

    bucket.count += 1;
  };
}

export const githubApiRateLimit = createUserRateLimiter({ limit: 30, windowMs: 60_000 });
