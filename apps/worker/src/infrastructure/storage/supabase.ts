import { env } from '../../config/env.js';

export const supabaseStorageConfig = {
  url: env.SUPABASE_URL,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: env.SUPABASE_STORAGE_BUCKET,
} as const;

// Supabase Storage upload/download helpers will be implemented here.
