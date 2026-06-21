import { nextCookies } from 'better-auth/next-js';
import { createAuth, type Auth } from '@punch-it/shared/auth';

let authInstance: Auth | undefined;

export function getAuth(): Auth {
  authInstance ??= createAuth([nextCookies()]);
  return authInstance;
}

export type { Auth, Session } from '@punch-it/shared/auth';

export async function getSession() {
  const { headers } = await import('next/headers');
  const auth = getAuth();
  return auth.api.getSession({ headers: await headers() });
}
