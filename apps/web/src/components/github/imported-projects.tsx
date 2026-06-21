'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@punch-it/ui/components/card';

import { ApiClientError } from '@/lib/api-client';
import { useProjects } from '@/hooks/use-github-repos';

export function ImportedProjects() {
  const projectsQuery = useProjects();

  if (projectsQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading projects…</p>;
  }

  if (projectsQuery.isError) {
    return (
      <p className="text-destructive text-sm">
        {projectsQuery.error instanceof ApiClientError
          ? projectsQuery.error.message
          : 'Failed to load projects.'}
      </p>
    );
  }

  const projects = projectsQuery.data?.data.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imported projects</CardTitle>
        <CardDescription>Repositories saved to your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No projects yet. Import a repository to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-muted-foreground text-sm">{project.slug}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">{project.team.name}</span>
                </div>
                {project.repositoryUrl ? (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary mt-2 inline-block text-sm hover:underline"
                  >
                    View on GitHub
                  </a>
                ) : null}
                <p className="text-muted-foreground mt-2 text-xs">
                  {project.defaultBranch}
                  {project.framework ? ` · ${project.framework}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
