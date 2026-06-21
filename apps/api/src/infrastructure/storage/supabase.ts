import { env } from '../../config/env.js';

export const supabaseStorageConfig = {
  url: env.SUPABASE_URL,
  anonKey: env.SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: env.SUPABASE_STORAGE_BUCKET,
} as const;

// Supabase Storage client will be initialized here when business logic is implemented.
