'use client';

import { Plus } from 'lucide-react';

import { ProjectCard } from '@/components/dashboard/project-card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@punch-it/ui/components/button';
import { StaggerContainer, StaggerItem } from '@/components/motion';
import { mockProjects } from '@/lib/mock-data';

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage and deploy your applications."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        }
      />

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockProjects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
