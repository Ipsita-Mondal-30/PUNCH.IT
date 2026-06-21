'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

type MeResponse = {
  success: true;
  data: {
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
  };
};

type GithubAccountResponse = {
  success: true;
  data: {
    account: {
      id: string;
      githubId: string;
      login: string;
      avatarUrl: string | null;
      profileUrl: string | null;
      scope: string | null;
      tokenExpiresAt: string | null;
    } | null;
    hasValidAccessToken: boolean;
  };
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient<MeResponse>('/v1/auth/me'),
  });
}

export function useGithubAccount() {
  return useQuery({
    queryKey: ['auth', 'github'],
    queryFn: () => apiClient<GithubAccountResponse>('/v1/auth/github'),
  });
}
