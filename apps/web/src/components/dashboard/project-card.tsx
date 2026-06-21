'use client';

import Link from 'next/link';
import { ExternalLink, MoreHorizontal, Rocket, Settings } from 'lucide-react';

import { Button } from '@punch-it/ui/components/button';
import { Card, CardContent } from '@punch-it/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@punch-it/ui/components/dropdown-menu';

import { HoverCard } from '@/components/motion';
import { ProjectStatusBadge } from '@/components/ui/status-badge';
import { formatDistanceToNow } from '@/lib/format';
import type { Project } from '@/types';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <HoverCard>
      <Card className="glass border-border/50 hover:border-primary/30 group transition-colors">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="group-hover:text-primary text-base font-semibold transition-colors"
              >
                {project.name}
              </Link>
              <p className="text-muted-foreground mt-1 text-xs">{project.repository}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>

          <div className="mb-4 flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">
              Framework: <span className="text-foreground">{project.framework}</span>
            </span>
            {project.domain && (
              <span className="text-muted-foreground truncate">{project.domain}</span>
            )}
          </div>

          <p className="text-muted-foreground mb-4 truncate text-xs">
            {project.lastDeployment} · {formatDistanceToNow(project.lastDeploymentAt)}
          </p>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                <ExternalLink className="h-3 w-3" />
                Open
              </Link>
            </Button>
            <Button size="sm" variant="neon">
              <Rocket className="h-3 w-3" />
              Deploy
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </HoverCard>
  );
}
