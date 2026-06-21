import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GitBranch } from 'lucide-react';

import { DeploymentTerminal } from '@/components/dashboard/deployment-terminal';
import { PageHeader } from '@/components/ui/page-header';
import { DeploymentStatusBadge } from '@/components/ui/status-badge';
import { Button } from '@punch-it/ui/components/button';
import { Card, CardContent } from '@punch-it/ui/components/card';
import { formatDate } from '@/lib/format';
import { getDeploymentById } from '@/lib/mock-data';

type DeploymentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeploymentDetailPage({ params }: DeploymentDetailPageProps) {
  const { id } = await params;
  const deployment = getDeploymentById(id);

  if (!deployment) {
    notFound();
  }

  const terminalStatus =
    deployment.status === 'building' || deployment.status === 'deploying'
      ? deployment.status
      : deployment.status === 'failed'
        ? 'failed'
        : 'success';

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/deployments">
            <ArrowLeft className="h-4 w-4" />
            Back to deployments
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Deployment ${deployment.commit}`}
        description={deployment.commitMessage}
        actions={<DeploymentStatusBadge status={deployment.status} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Project</p>
            <Link
              href={`/dashboard/projects/${deployment.projectId}`}
              className="hover:text-primary mt-1 text-sm font-medium transition-colors"
            >
              {deployment.projectName}
            </Link>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Branch</p>
            <p className="mt-1 flex items-center gap-1 text-sm">
              <GitBranch className="h-3 w-3" />
              {deployment.branch}
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Duration</p>
            <p className="mt-1 text-sm font-medium">{deployment.duration}</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">Started</p>
            <p className="mt-1 text-sm">{formatDate(deployment.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <DeploymentTerminal status={terminalStatus} />
    </div>
  );
}
