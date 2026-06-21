import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';

import { prisma } from '../db/index.js';
import { validateEnv, authEnvSchema } from '../env/index.js';
import { syncGithubAccountFromOAuth } from './github/index.js';

type AuthPlugin = NonNullable<BetterAuthOptions['plugins']>[number];

function getAuthEnv() {
  return validateEnv(authEnvSchema);
}

export function createAuth(extraPlugins: AuthPlugin[] = []) {
  const env = getAuthEnv();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL],
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        scope: ['read:user', 'user:email', 'read:org', 'repo'],
      },
    },
    databaseHooks: {
      account: {
        create: {
          after: async (account) => {
            await syncGithubAccountFromOAuth(account);
          },
        },
        update: {
          after: async (account) => {
            await syncGithubAccountFromOAuth(account);
          },
        },
      },
    },
    plugins: [bearer(), ...extraPlugins],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth['$Infer']['Session'];
