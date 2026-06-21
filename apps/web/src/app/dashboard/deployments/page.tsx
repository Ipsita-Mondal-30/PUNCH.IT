import Link from 'next/link';

import { PageHeader } from '@/components/ui/page-header';
import { DeploymentStatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent } from '@punch-it/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@punch-it/ui/components/table';
import { formatDate } from '@/lib/format';
import { mockDeployments } from '@/lib/mock-data';

export default function DeploymentsPage() {
  return (
    <div>
      <PageHeader title="Deployments" description="View all deployments across your projects." />

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDeployments.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell>
                    <DeploymentStatusBadge status={dep.status} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/projects/${dep.projectId}`}
                      className="hover:text-primary text-sm font-medium transition-colors"
                    >
                      {dep.projectName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/deployments/${dep.id}`}
                      className="hover:text-primary font-mono text-xs transition-colors"
                    >
                      {dep.commit}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{dep.branch}</TableCell>
                  <TableCell className="text-xs">{dep.duration}</TableCell>
                  <TableCell className="text-xs">{dep.author}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(dep.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
