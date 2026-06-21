import { prisma } from '../../db/index.js';
import { decryptSecret, encryptSecret, resolveEncryptionSecret } from '../crypto.js';
import { validateEnv, authEnvSchema } from '../../env/index.js';

type GitHubAccountRecord = {
  id: string;
  userId: string;
  githubId: string;
  login: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  scope: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  deletedAt: Date | null;
};

type OAuthAccount = {
  userId: string;
  providerId: string;
  accountId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
};

type GitHubProfile = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  email?: string | null;
};

function getAuthEnv() {
  return validateEnv(authEnvSchema);
}

function getEncryptionSecret(): string {
  const env = getAuthEnv();
  return resolveEncryptionSecret(env.TOKEN_ENCRYPTION_KEY, env.BETTER_AUTH_SECRET);
}

export async function fetchGitHubProfile(accessToken: string): Promise<GitHubProfile> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub profile: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<GitHubProfile>;
}

export async function syncGithubAccountFromOAuth(account: OAuthAccount): Promise<void> {
  if (account.providerId !== 'github' || !account.accessToken) {
    return;
  }

  const profile = await fetchGitHubProfile(account.accessToken);
  const encryptionSecret = getEncryptionSecret();

  await prisma.githubAccount.upsert({
    where: { githubId: String(profile.id) },
    create: {
      userId: account.userId,
      githubId: String(profile.id),
      login: profile.login,
      accessToken: encryptSecret(account.accessToken, encryptionSecret),
      refreshToken: account.refreshToken
        ? encryptSecret(account.refreshToken, encryptionSecret)
        : null,
      tokenExpiresAt: account.accessTokenExpiresAt ?? null,
      scope: account.scope ?? null,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
    },
    update: {
      userId: account.userId,
      login: profile.login,
      accessToken: encryptSecret(account.accessToken, encryptionSecret),
      refreshToken: account.refreshToken
        ? encryptSecret(account.refreshToken, encryptionSecret)
        : null,
      tokenExpiresAt: account.accessTokenExpiresAt ?? null,
      scope: account.scope ?? null,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      deletedAt: null,
    },
  });
}

export async function getGithubAccountForUser(userId: string) {
  return prisma.githubAccount.findFirst({
    where: { userId, deletedAt: null },
    select: {
      id: true,
      githubId: true,
      login: true,
      avatarUrl: true,
      profileUrl: true,
      scope: true,
      tokenExpiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getDecryptedGithubAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.githubAccount.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!account?.accessToken) {
    return null;
  }

  return resolveAccessToken(account);
}

export async function getDecryptedGithubAccessTokenByAccountId(
  accountId: string,
): Promise<string | null> {
  const account = await prisma.githubAccount.findFirst({
    where: { id: accountId, deletedAt: null },
  });

  if (!account?.accessToken) {
    return null;
  }

  return resolveAccessToken(account);
}

async function resolveAccessToken(account: GitHubAccountRecord): Promise<string> {
  const encryptionSecret = getEncryptionSecret();
  let accessToken = decryptSecret(account.accessToken!, encryptionSecret);

  const isExpired =
    account.tokenExpiresAt !== null && account.tokenExpiresAt.getTime() <= Date.now();

  if (isExpired && account.refreshToken) {
    accessToken = await refreshGithubAccessToken(account, encryptionSecret);
  }

  return accessToken;
}

async function refreshGithubAccessToken(
  account: GitHubAccountRecord,
  encryptionSecret: string,
): Promise<string> {
  if (!account.refreshToken) {
    throw new Error('GitHub access token expired and no refresh token is available');
  }

  const env = getAuthEnv();
  const refreshToken = decryptSecret(account.refreshToken, encryptionSecret);

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh GitHub token: ${response.status}`);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!payload.access_token || payload.error) {
    throw new Error(payload.error ?? 'GitHub token refresh returned no access token');
  }

  const tokenExpiresAt =
    payload.expires_in !== undefined ? new Date(Date.now() + payload.expires_in * 1000) : null;

  await prisma.githubAccount.update({
    where: { id: account.id },
    data: {
      accessToken: encryptSecret(payload.access_token, encryptionSecret),
      refreshToken: payload.refresh_token
        ? encryptSecret(payload.refresh_token, encryptionSecret)
        : account.refreshToken,
      tokenExpiresAt,
    },
  });

  return payload.access_token;
}

export type PublicGithubAccount = NonNullable<Awaited<ReturnType<typeof getGithubAccountForUser>>>;
