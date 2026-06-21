# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile --filter @punch-it/worker...

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm --filter @punch-it/shared db:generate
RUN pnpm --filter @punch-it/worker build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache docker-cli git curl bash && \
    curl -sSL https://sdk.cloud.google.com | bash -s -- --disable-prompts --install-dir=/opt && \
    ln -s /opt/google-cloud-sdk/bin/gcloud /usr/local/bin/gcloud && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 punchit && \
    addgroup punchit docker

COPY --from=builder --chown=punchit:nodejs /app/apps/worker/dist ./dist
COPY --from=builder --chown=punchit:nodejs /app/apps/worker/package.json ./
COPY --from=builder --chown=punchit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=punchit:nodejs /app/packages/shared/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=punchit:nodejs /app/packages/shared/node_modules/@prisma ./node_modules/@prisma

USER punchit
CMD ["node", "dist/worker.js"]
