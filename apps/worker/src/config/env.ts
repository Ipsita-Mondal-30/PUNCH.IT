import { workerEnvSchema, validateEnv } from '@punch-it/shared/env';

export const env = validateEnv(workerEnvSchema);

export type Env = typeof env;
