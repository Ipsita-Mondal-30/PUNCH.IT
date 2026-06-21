import { webClientEnvSchema, validateEnv } from '@punch-it/shared/env';

export const clientEnv = validateEnv(webClientEnvSchema, {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
