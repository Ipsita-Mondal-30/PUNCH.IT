-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('PENDING', 'QUEUED', 'BUILDING', 'DEPLOYING', 'READY', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeploymentTarget" AS ENUM ('PRODUCTION', 'PREVIEW', 'DEVELOPMENT');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "LogSource" AS ENUM ('BUILD', 'DEPLOY', 'SYSTEM', 'RUNTIME');

-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'ACTIVE', 'ERROR', 'REMOVED');

-- CreateEnum
CREATE TYPE "SslStatus" AS ENUM ('PENDING', 'ACTIVE', 'ERROR');

-- CreateEnum
CREATE TYPE "EnvironmentTarget" AS ENUM ('PRODUCTION', 'PREVIEW', 'DEVELOPMENT', 'ALL');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('BUILD_OUTPUT', 'SOURCE', 'CACHE', 'LOG_ARCHIVE');

-- CreateEnum
CREATE TYPE "AssetPurpose" AS ENUM ('LOGO', 'FAVICON', 'OG_IMAGE', 'MISC');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(255),
    "image" VARCHAR(2048),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(64) NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ(6),
    "refreshTokenExpiresAt" TIMESTAMPTZ(6),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(1024),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" UUID NOT NULL,
    "identifier" VARCHAR(320) NOT NULL,
    "value" VARCHAR(512) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "githubId" VARCHAR(64) NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "installationId" VARCHAR(64),
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMPTZ(6),
    "scope" TEXT,
    "avatarUrl" VARCHAR(2048),
    "profileUrl" VARCHAR(2048),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "github_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "avatarUrl" VARCHAR(2048),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "teamId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "githubAccountId" UUID,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "repositoryUrl" VARCHAR(2048),
    "githubRepoId" VARCHAR(64),
    "defaultBranch" VARCHAR(255) NOT NULL DEFAULT 'main',
    "framework" VARCHAR(64),
    "rootDirectory" VARCHAR(512),
    "buildCommand" VARCHAR(512),
    "installCommand" VARCHAR(512),
    "outputDirectory" VARCHAR(512),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployments" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'PENDING',
    "target" "DeploymentTarget" NOT NULL DEFAULT 'PREVIEW',
    "gitBranch" VARCHAR(255),
    "gitCommitSha" VARCHAR(64),
    "gitCommitMessage" TEXT,
    "gitAuthorName" VARCHAR(255),
    "gitAuthorEmail" VARCHAR(320),
    "url" VARCHAR(2048),
    "inspectorUrl" VARCHAR(2048),
    "readyAt" TIMESTAMPTZ(6),
    "buildingAt" TIMESTAMPTZ(6),
    "meta" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_logs" (
    "id" UUID NOT NULL,
    "deploymentId" UUID NOT NULL,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "source" "LogSource" NOT NULL DEFAULT 'BUILD',
    "message" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "loggedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deployment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "deploymentId" UUID,
    "name" VARCHAR(253) NOT NULL,
    "status" "DomainStatus" NOT NULL DEFAULT 'PENDING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationType" VARCHAR(32),
    "verificationValue" VARCHAR(512),
    "sslStatus" "SslStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_variables" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "deploymentId" UUID,
    "scopeKey" VARCHAR(36) NOT NULL DEFAULT 'project',
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "target" "EnvironmentTarget" NOT NULL DEFAULT 'ALL',
    "isSecret" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "environment_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_artifacts" (
    "id" UUID NOT NULL,
    "deploymentId" UUID NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "storageKey" VARCHAR(1024) NOT NULL,
    "storageBucket" VARCHAR(255) NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "checksumSha256" VARCHAR(64),
    "mimeType" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "build_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "teamId" UUID,
    "projectId" UUID,
    "deploymentId" UUID,
    "name" VARCHAR(255) NOT NULL,
    "purpose" "AssetPurpose" NOT NULL DEFAULT 'MISC',
    "storageKey" VARCHAR(1024) NOT NULL,
    "storageBucket" VARCHAR(255) NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "contentType" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "projectId" UUID,
    "githubDeliveryId" VARCHAR(255),
    "eventType" VARCHAR(128) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON "accounts"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_accounts_githubId_key" ON "github_accounts"("githubId");

-- CreateIndex
CREATE INDEX "github_accounts_userId_deletedAt_idx" ON "github_accounts"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "github_accounts_login_idx" ON "github_accounts"("login");

-- CreateIndex
CREATE INDEX "github_accounts_installationId_idx" ON "github_accounts"("installationId");

-- CreateIndex
CREATE UNIQUE INDEX "github_accounts_userId_githubId_key" ON "github_accounts"("userId", "githubId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- CreateIndex
CREATE INDEX "teams_deletedAt_idx" ON "teams"("deletedAt");

-- CreateIndex
CREATE INDEX "teams_createdAt_idx" ON "teams"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "team_members_userId_deletedAt_idx" ON "team_members"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "team_members_teamId_role_deletedAt_idx" ON "team_members"("teamId", "role", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_teamId_userId_key" ON "team_members"("teamId", "userId");

-- CreateIndex
CREATE INDEX "projects_teamId_deletedAt_idx" ON "projects"("teamId", "deletedAt");

-- CreateIndex
CREATE INDEX "projects_githubRepoId_idx" ON "projects"("githubRepoId");

-- CreateIndex
CREATE INDEX "projects_creatorId_idx" ON "projects"("creatorId");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "projects_teamId_slug_key" ON "projects"("teamId", "slug");

-- CreateIndex
CREATE INDEX "deployments_projectId_status_createdAt_idx" ON "deployments"("projectId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "deployments_projectId_createdAt_idx" ON "deployments"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "deployments_projectId_target_createdAt_idx" ON "deployments"("projectId", "target", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "deployments_creatorId_createdAt_idx" ON "deployments"("creatorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "deployments_status_createdAt_idx" ON "deployments"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "deployments_deletedAt_idx" ON "deployments"("deletedAt");

-- CreateIndex
CREATE INDEX "deployment_logs_deploymentId_loggedAt_idx" ON "deployment_logs"("deploymentId", "loggedAt" ASC);

-- CreateIndex
CREATE INDEX "deployment_logs_deploymentId_level_loggedAt_idx" ON "deployment_logs"("deploymentId", "level", "loggedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "deployment_logs_deploymentId_sequence_key" ON "deployment_logs"("deploymentId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- CreateIndex
CREATE INDEX "domains_projectId_deletedAt_idx" ON "domains"("projectId", "deletedAt");

-- CreateIndex
CREATE INDEX "domains_deploymentId_idx" ON "domains"("deploymentId");

-- CreateIndex
CREATE INDEX "domains_status_deletedAt_idx" ON "domains"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "environment_variables_projectId_target_deletedAt_idx" ON "environment_variables"("projectId", "target", "deletedAt");

-- CreateIndex
CREATE INDEX "environment_variables_deploymentId_deletedAt_idx" ON "environment_variables"("deploymentId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "environment_variables_projectId_key_target_scopeKey_key" ON "environment_variables"("projectId", "key", "target", "scopeKey");

-- CreateIndex
CREATE INDEX "build_artifacts_deploymentId_type_deletedAt_idx" ON "build_artifacts"("deploymentId", "type", "deletedAt");

-- CreateIndex
CREATE INDEX "build_artifacts_deploymentId_createdAt_idx" ON "build_artifacts"("deploymentId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "build_artifacts_checksumSha256_idx" ON "build_artifacts"("checksumSha256");

-- CreateIndex
CREATE INDEX "assets_teamId_deletedAt_idx" ON "assets"("teamId", "deletedAt");

-- CreateIndex
CREATE INDEX "assets_projectId_purpose_deletedAt_idx" ON "assets"("projectId", "purpose", "deletedAt");

-- CreateIndex
CREATE INDEX "assets_deploymentId_deletedAt_idx" ON "assets"("deploymentId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_githubDeliveryId_key" ON "webhook_events"("githubDeliveryId");

-- CreateIndex
CREATE INDEX "webhook_events_status_createdAt_idx" ON "webhook_events"("status", "createdAt" ASC);

-- CreateIndex
CREATE INDEX "webhook_events_projectId_createdAt_idx" ON "webhook_events"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "webhook_events_eventType_createdAt_idx" ON "webhook_events"("eventType", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_accounts" ADD CONSTRAINT "github_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_githubAccountId_fkey" FOREIGN KEY ("githubAccountId") REFERENCES "github_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_logs" ADD CONSTRAINT "deployment_logs_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_variables" ADD CONSTRAINT "environment_variables_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_variables" ADD CONSTRAINT "environment_variables_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_artifacts" ADD CONSTRAINT "build_artifacts_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
