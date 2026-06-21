'use client';

import { useMemo, useState } from 'react';

import { Button } from '@punch-it/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@punch-it/ui/components/card';

import { ApiClientError } from '@/lib/api-client';
import { useGithubAccount } from '@/hooks/use-auth-api';
import {
  useGithubRepoSearch,
  useGithubRepos,
  useImportProject,
  useProjects,
} from '@/hooks/use-github-repos';
import type { GithubRepositorySummary } from '@punch-it/types/github';

function RepositoryRow({
  repo,
  onImport,
  isImporting,
  isImported,
}: {
  repo: GithubRepositorySummary;
  onImport: (repo: GithubRepositorySummary) => void;
  isImporting: boolean;
  isImported: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{repo.fullName}</p>
          {repo.isPrivate ? (
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
              Private
            </span>
          ) : null}
        </div>
        {repo.description ? (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{repo.description}</p>
        ) : null}
        <p className="text-muted-foreground mt-2 text-xs">
          {repo.language ?? 'Unknown language'} · {repo.defaultBranch} · Updated{' '}
          {new Date(repo.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        size="sm"
        variant={isImported ? 'secondary' : 'default'}
        disabled={isImporting || isImported}
        onClick={() => onImport(repo)}
      >
        {isImported ? 'Imported' : isImporting ? 'Importing…' : 'Import'}
      </Button>
    </div>
  );
}

export function RepositoryPicker() {
  const [search, setSearch] = useState('');
  const [importingRepoId, setImportingRepoId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const githubAccountQuery = useGithubAccount();
  const projectsQuery = useProjects();
  const importProject = useImportProject();

  const isSearchActive = search.trim().length > 0;

  const reposQuery = useGithubRepos({
    enabled: !isSearchActive && githubAccountQuery.data?.data.hasValidAccessToken === true,
  });

  const searchQuery = useGithubRepoSearch({
    query: search,
    enabled: isSearchActive && githubAccountQuery.data?.data.hasValidAccessToken === true,
  });

  const activeQuery = isSearchActive ? searchQuery : reposQuery;
  const repositories = activeQuery.data?.data.items ?? [];

  const importedRepoIds = useMemo(() => {
    const ids = new Set<string>();
    for (const project of projectsQuery.data?.data.items ?? []) {
      if (project.githubRepoId) {
        ids.add(project.githubRepoId);
      }
    }
    return ids;
  }, [projectsQuery.data?.data.items]);

  const handleImport = async (repo: GithubRepositorySummary) => {
    setFeedback(null);
    setImportingRepoId(repo.id);

    try {
      await importProject.mutateAsync({ githubRepoId: repo.id });
      setFeedback({ type: 'success', message: `${repo.fullName} imported successfully.` });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Failed to import repository. Please try again.';
      setFeedback({ type: 'error', message });
    } finally {
      setImportingRepoId(null);
    }
  };

  if (githubAccountQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Checking GitHub connection…</p>;
  }

  if (!githubAccountQuery.data?.data.account) {
    return (
      <p className="text-muted-foreground text-sm">
        Sign in with GitHub to browse and import your repositories.
      </p>
    );
  }

  if (!githubAccountQuery.data.data.hasValidAccessToken) {
    return (
      <p className="text-muted-foreground text-sm">
        Your GitHub token is invalid or expired. Sign out and sign in again with GitHub.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import repository</CardTitle>
        <CardDescription>
          Browse or search your GitHub repositories and import one as a PUNCH.IT project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search repositories…"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />

        {feedback ? (
          <p
            className={
              feedback.type === 'success' ? 'text-sm text-green-600' : 'text-destructive text-sm'
            }
          >
            {feedback.message}
          </p>
        ) : null}

        {activeQuery.isLoading ? (
          <p className="text-muted-foreground text-sm">Loading repositories…</p>
        ) : null}

        {activeQuery.isError ? (
          <p className="text-destructive text-sm">
            {activeQuery.error instanceof ApiClientError
              ? activeQuery.error.message
              : 'Failed to load repositories.'}
          </p>
        ) : null}

        {!activeQuery.isLoading && !activeQuery.isError && repositories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No repositories found.</p>
        ) : null}

        <div>
          {repositories.map((repo) => (
            <RepositoryRow
              key={repo.id}
              repo={repo}
              onImport={handleImport}
              isImporting={importingRepoId === repo.id}
              isImported={importedRepoIds.has(repo.id)}
            />
          ))}
        </div>

        {activeQuery.data?.data.rateLimitRemaining !== null &&
        activeQuery.data?.data.rateLimitRemaining !== undefined ? (
          <p className="text-muted-foreground text-xs">
            GitHub API requests remaining: {activeQuery.data.data.rateLimitRemaining}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
