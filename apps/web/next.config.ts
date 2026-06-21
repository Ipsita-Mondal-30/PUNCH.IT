import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadEnv } from 'dotenv';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
loadEnv({ path: path.join(monorepoRoot, '.env') });

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@punch-it/ui', '@punch-it/shared', '@punch-it/types'],
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
