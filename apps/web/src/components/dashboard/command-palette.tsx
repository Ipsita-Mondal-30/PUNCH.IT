'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, Globe, LayoutDashboard, Rocket, Settings, Users } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@punch-it/ui/components/command';

import { mockProjects } from '@/lib/mock-data';

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const navigate = (path: string) => {
    onOpenChange(false);
    router.push(path as '/dashboard');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/projects')}>
            <Rocket className="mr-2 h-4 w-4" />
            Projects
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/deployments')}>
            <Rocket className="mr-2 h-4 w-4" />
            Deployments
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/domains')}>
            <Globe className="mr-2 h-4 w-4" />
            Domains
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/teams')}>
            <Users className="mr-2 h-4 w-4" />
            Teams
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/analytics')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {mockProjects.slice(0, 5).map((project) => (
            <CommandItem
              key={project.id}
              onSelect={() => navigate(`/dashboard/projects/${project.id}`)}
            >
              <Rocket className="mr-2 h-4 w-4" />
              {project.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
