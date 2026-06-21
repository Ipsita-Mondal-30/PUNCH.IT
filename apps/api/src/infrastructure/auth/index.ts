import { createAuth, type Auth, type Session } from '@punch-it/shared/auth';

let authInstance: Auth | undefined;

export function getAuth(): Auth {
  authInstance ??= createAuth();
  return authInstance;
}

export type AuthenticatedContext = {
  user: Session['user'];
  session: Session['session'];
};

export async function getSessionFromRequest(
  headers: Record<string, string | string[] | undefined>,
) {
  const auth = getAuth();
  const normalizedHeaders = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    normalizedHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  return auth.api.getSession({ headers: normalizedHeaders });
}
