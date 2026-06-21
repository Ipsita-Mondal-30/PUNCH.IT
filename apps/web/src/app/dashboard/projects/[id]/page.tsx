import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, GitBranch, Globe, Rocket } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { DeploymentStatusBadge, ProjectStatusBadge } from '@/components/ui/status-badge';
import { Button } from '@punch-it/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@punch-it/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@punch-it/ui/components/table';
import { formatDate } from '@/lib/format';
import { getDeploymentsByProjectId, getProjectById, mockEnvVariables } from '@/lib/mock-data';

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const deployments = getDeploymentsByProjectId(id);

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.repository}
        actions={
          <>
            <Button variant="outline" asChild>
              <a href={`https://github.com/${project.repository}`} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Repository
              </a>
            </Button>
            <Button variant="neon">
              <Rocket className="h-4 w-4" />
              Deploy
            </Button>
          </>
        }
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">Framework</dt>
                <dd className="mt-1 text-sm font-medium">{project.framework}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Status</dt>
                <dd className="mt-1">
                  <ProjectStatusBadge status={project.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Branch</dt>
                <dd className="mt-1 flex items-center gap-1 text-sm">
                  <GitBranch className="h-3 w-3" />
                  {project.branch}
                </dd>
              </div>
              {project.domain && (
                <div>
                  <dt className="text-muted-foreground text-xs">Domain</dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm">
                    <Globe className="h-3 w-3" />
                    {project.domain}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-muted-foreground text-xs">Owner/Repo</dt>
                <dd className="mt-1 font-mono text-sm">{project.repository}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Last Commit</dt>
                <dd className="mt-1 text-sm">{project.lastDeployment}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/50 mb-8">
        <CardHeader>
          <CardTitle className="text-base">Deployment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell>
                    <DeploymentStatusBadge status={dep.status} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/deployments/${dep.id}`}
                      className="hover:text-primary font-mono text-xs transition-colors"
                    >
                      {dep.commit}
                    </Link>
                    <p className="text-muted-foreground mt-0.5 max-w-xs truncate text-xs">
                      {dep.commitMessage}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{dep.branch}</TableCell>
                  <TableCell className="text-xs">{dep.duration}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(dep.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Environment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEnvVariables.map((env) => (
                <TableRow key={env.id}>
                  <TableCell className="font-mono text-xs">{env.key}</TableCell>
                  <TableCell className="font-mono text-xs">{env.value}</TableCell>
                  <TableCell className="text-xs capitalize">{env.environment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
