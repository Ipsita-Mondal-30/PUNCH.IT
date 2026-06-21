import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@punch-it/ui/components/badge';
import { Button } from '@punch-it/ui/components/button';
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
import { mockDomains } from '@/lib/mock-data';

const verificationVariant = {
  verified: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
};

const sslVariant = {
  active: 'success' as const,
  pending: 'warning' as const,
  expired: 'error' as const,
};

export default function DomainsPage() {
  return (
    <div>
      <PageHeader
        title="Domains"
        description="Manage custom domains and SSL certificates."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add Domain
          </Button>
        }
      />

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>SSL Status</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDomains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-mono text-sm">{domain.domain}</TableCell>
                  <TableCell className="text-sm">{domain.projectName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={verificationVariant[domain.verificationStatus]}
                      className="text-[11px] capitalize"
                    >
                      {domain.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sslVariant[domain.sslStatus]}
                      className="text-[11px] capitalize"
                    >
                      {domain.sslStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(domain.createdAt)}
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
