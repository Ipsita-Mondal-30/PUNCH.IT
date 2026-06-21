# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile --filter @punch-it/api...

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm --filter @punch-it/shared db:generate
RUN pnpm --filter @punch-it/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 punchit

COPY --from=builder --chown=punchit:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=punchit:nodejs /app/apps/api/package.json ./
COPY --from=builder --chown=punchit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=punchit:nodejs /app/packages/shared/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=punchit:nodejs /app/packages/shared/node_modules/@prisma ./node_modules/@prisma

USER punchit
EXPOSE 4000
ENV API_HOST=0.0.0.0
ENV API_PORT=4000

CMD ["node", "dist/server.js"]
