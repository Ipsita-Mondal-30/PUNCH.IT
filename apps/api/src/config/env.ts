import { apiEnvSchema, validateEnv } from '@punch-it/shared/env';

export const env = validateEnv(apiEnvSchema);

export type Env = typeof env;
