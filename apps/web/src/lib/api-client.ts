import { clientEnv } from '@/config/env.client';
import { getBearerToken } from '@/lib/auth-client';
import type { ApiErrorResponse } from '@punch-it/types';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, error: ApiErrorResponse['error']) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
  auth?: boolean;
};

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, auth = true, ...init } = options;

  const url = new URL(`${clientEnv.NEXT_PUBLIC_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const bearerToken = getBearerToken();
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    credentials: 'include',
  });

  const payload = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'success' in payload &&
      !payload.success
    ) {
      throw new ApiClientError(response.status, payload.error);
    }
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return payload as T;
}
