import { z } from 'zod';

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql'),
  DIRECT_URL: z.string().url().startsWith('postgresql').optional(),
});

export const redisEnvSchema = z.object({
  REDIS_URL: z.string().url().startsWith('redis'),
});

export const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default('deployments'),
});

export const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
});

const optionalUrl = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().optional(),
);

export const sentryEnvSchema = z.object({
  SENTRY_DSN: optionalUrl,
  SENTRY_AUTH_TOKEN: optionalString,
  SENTRY_ORG: optionalString,
  SENTRY_PROJECT: optionalString,
});

export const webClientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const apiEnvSchema = baseEnvSchema
  .merge(databaseEnvSchema)
  .merge(redisEnvSchema)
  .merge(supabaseEnvSchema)
  .merge(authEnvSchema)
  .merge(sentryEnvSchema)
  .extend({
    API_PORT: z.coerce.number().int().positive().default(4000),
    API_HOST: z.string().default('0.0.0.0'),
  });

export const gcpEnvSchema = z.object({
  GCP_PROJECT_ID: z.string().min(1),
  GCP_REGION: z.string().min(1).default('us-central1'),
  GCP_ARTIFACT_REGISTRY: z.string().min(1),
  GCP_CLOUD_RUN_SERVICE_PREFIX: z.string().default('punchit-app-'),
});

export const workerEnvSchema = baseEnvSchema
  .merge(databaseEnvSchema)
  .merge(redisEnvSchema)
  .merge(supabaseEnvSchema)
  .merge(sentryEnvSchema)
  .merge(gcpEnvSchema)
  .merge(authEnvSchema);

export const webServerEnvSchema = baseEnvSchema
  .merge(webClientEnvSchema)
  .merge(authEnvSchema)
  .merge(sentryEnvSchema);

export type ApiEnv = z.infer<typeof apiEnvSchema>;
export type WorkerEnv = z.infer<typeof workerEnvSchema>;
export type WebClientEnv = z.infer<typeof webClientEnvSchema>;
export type WebServerEnv = z.infer<typeof webServerEnvSchema>;

export function validateEnv<T extends z.ZodType>(
  schema: T,
  env: Record<string, string | undefined> = process.env,
): z.infer<T> {
  const result = schema.safeParse(env);

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    const message = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(', ')}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${message}`);
  }

  return result.data;
}

export function createEnvValidator<T extends z.ZodType>(schema: T) {
  return (env: Record<string, string | undefined> = process.env) => validateEnv(schema, env);
}
