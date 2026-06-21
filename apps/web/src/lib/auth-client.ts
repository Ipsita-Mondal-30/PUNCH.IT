'use client';

import { createAuthClient } from 'better-auth/react';

import { clientEnv } from '@/config/env.client';

const BEARER_TOKEN_KEY = 'punch_it_bearer_token';

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    onSuccess: (context) => {
      const token = context.response.headers.get('set-auth-token');
      if (token) {
        sessionStorage.setItem(BEARER_TOKEN_KEY, token);
      }
    },
  },
});

export const { useSession } = authClient;

export function getBearerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(BEARER_TOKEN_KEY);
}

export function clearBearerToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(BEARER_TOKEN_KEY);
}

export async function signInWithGitHub(callbackURL = '/dashboard') {
  return authClient.signIn.social({
    provider: 'github',
    callbackURL,
  });
}

export async function signOutUser() {
  clearBearerToken();
  return authClient.signOut();
}
