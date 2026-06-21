import type { FastifyInstance } from 'fastify';
import type { ApiResponse } from '@punch-it/types';

import {
  getDecryptedGithubAccessToken,
  getGithubAccountForUser,
} from '@punch-it/shared/auth/github';

import { requireAuth } from '../plugins/auth.plugin.js';

type MeResponse = ApiResponse<{
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  session: {
    id: string;
    expiresAt: string;
  };
}>;

type GithubAccountResponse = ApiResponse<{
  account: Awaited<ReturnType<typeof getGithubAccountForUser>>;
  hasValidAccessToken: boolean;
}>;

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/me',
    {
      preHandler: requireAuth,
    },
    async (request): Promise<MeResponse> => {
      const { user, session } = request.auth!;

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
          },
          session: {
            id: session.id,
            expiresAt: session.expiresAt.toISOString(),
          },
        },
      };
    },
  );

  fastify.get(
    '/github',
    {
      preHandler: requireAuth,
    },
    async (request): Promise<GithubAccountResponse> => {
      const account = await getGithubAccountForUser(request.auth!.user.id);
      let hasValidAccessToken = false;

      if (account) {
        try {
          const token = await getDecryptedGithubAccessToken(request.auth!.user.id);
          hasValidAccessToken = Boolean(token);
        } catch {
          hasValidAccessToken = false;
        }
      }

      return {
        success: true,
        data: {
          account,
          hasValidAccessToken,
        },
      };
    },
  );
}
