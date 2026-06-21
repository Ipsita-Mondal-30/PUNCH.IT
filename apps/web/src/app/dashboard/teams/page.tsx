import Image from 'next/image';

import { InviteMemberDialog } from '@/components/dashboard/invite-member-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@punch-it/ui/components/badge';
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
import { mockTeamMembers } from '@/lib/mock-data';
import type { TeamRole } from '@/types';

const roleVariant: Record<TeamRole, 'default' | 'secondary' | 'outline'> = {
  owner: 'default',
  developer: 'secondary',
  viewer: 'outline',
};

export default function TeamsPage() {
  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage team members and their access levels."
        actions={<InviteMemberDialog />}
      />

      <Card className="glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={32}
                          height={32}
                          className="rounded-xl"
                        />
                      ) : (
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[member.role]} className="text-[11px] capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(member.joinedAt)}
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
