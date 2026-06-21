import { Badge } from '@punch-it/ui/components/badge';
import { cn } from '@punch-it/ui/lib/utils';

import type { DeploymentStatus, ProjectStatus } from '@/types';

const deploymentStatusMap: Record<
  DeploymentStatus,
  { label: string; variant: 'success' | 'error' | 'warning' | 'info' | 'secondary' }
> = {
  success: { label: 'Success', variant: 'success' },
  failed: { label: 'Failed', variant: 'error' },
  building: { label: 'Building', variant: 'warning' },
  deploying: { label: 'Deploying', variant: 'info' },
  queued: { label: 'Queued', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
};

const projectStatusMap: Record<
  ProjectStatus,
  { label: string; variant: 'success' | 'error' | 'warning' | 'secondary' }
> = {
  live: { label: 'Live', variant: 'success' },
  building: { label: 'Building', variant: 'warning' },
  failed: { label: 'Failed', variant: 'error' },
  paused: { label: 'Paused', variant: 'secondary' },
};

export function DeploymentStatusBadge({
  status,
  className,
}: {
  status: DeploymentStatus;
  className?: string;
}) {
  const config = deploymentStatusMap[status];
  return (
    <Badge variant={config.variant} className={cn('font-mono text-[11px]', className)}>
      {config.label}
    </Badge>
  );
}

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const config = projectStatusMap[status];
  return (
    <Badge variant={config.variant} className={cn('font-mono text-[11px]', className)}>
      {config.label}
    </Badge>
  );
}
