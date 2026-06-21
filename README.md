# PUNCH.IT

A production-grade, Vercel-like deployment platform monorepo.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend | Fastify, TypeScript, Zod, Prisma |
| Database | PostgreSQL (Supabase) |
| Queue | Redis, BullMQ |
| Storage | Supabase Storage |
| Auth | Better Auth, GitHub OAuth |
| Monitoring | Sentry, Pino |
| Deployment | Docker, Google Cloud Run |

## Monorepo Structure

```
apps/
  web/       → Next.js 15 frontend
  api/       → Fastify REST API
  worker/    → BullMQ background worker
packages/
  ui/        → Shared shadcn/ui components
  types/     → Shared TypeScript types
  shared/    → Env validation, Prisma, constants
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker (optional, for local services)

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start local Postgres & Redis
docker compose up postgres redis -d

# Generate Prisma client & push schema
pnpm db:generate
pnpm db:push

# Start all apps in development
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Architecture

Each backend app follows clean architecture:

```
src/
  config/          → Environment & app configuration
  domain/          → Entities & interfaces
  application/     → Use cases (business logic)
  infrastructure/  → External services (DB, Redis, Sentry)
  presentation/    → Routes & HTTP handlers (API only)
  jobs/            → Job processors (Worker only)
```

## Deployment

Docker images are built for Google Cloud Run:

```bash
# Build API image
docker build -f apps/api/Dockerfile -t punch-it-api .

# Build Worker image
docker build -f apps/worker/Dockerfile -t punch-it-worker .

# Build Web image
docker build -f apps/web/Dockerfile -t punch-it-web .
```

## License

Private
