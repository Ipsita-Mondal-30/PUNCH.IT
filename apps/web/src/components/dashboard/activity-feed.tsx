'use client';

import { formatDistanceToNow } from '@/lib/format';
import type { ActivityItem } from '@/types';

import { DeploymentStatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@punch-it/ui/components/card';
import { StaggerContainer, StaggerItem } from '@/components/motion';

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <StaggerContainer className="space-y-4">
          {items.map((item) => (
            <StaggerItem
              key={item.id}
              className="border-border/50 flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm">{item.message}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatDistanceToNow(item.timestamp)}
                </p>
              </div>
              {item.status && <DeploymentStatusBadge status={item.status} />}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </CardContent>
    </Card>
  );
}
