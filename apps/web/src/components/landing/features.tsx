'use client';

import {
  Bot,
  Globe,
  GitBranch,
  History,
  LineChart,
  RotateCcw,
  ScrollText,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@punch-it/ui/components/card';

import { FadeIn, HoverCard, StaggerContainer, StaggerItem } from '@/components/motion';

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    description:
      'Connect your repos in one click. Auto-detect frameworks and configure builds instantly.',
  },
  {
    icon: History,
    title: 'Auto Deployments',
    description: 'Every push triggers a production-ready deployment with preview URLs for PRs.',
  },
  {
    icon: RotateCcw,
    title: 'Rollbacks',
    description: 'One-click rollbacks to any previous deployment. Zero downtime guaranteed.',
  },
  {
    icon: ScrollText,
    title: 'Build Logs',
    description:
      'Real-time streaming logs with syntax highlighting and intelligent error detection.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Role-based access control with invite flows and audit logs for your entire team.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Automatic SSL provisioning with DNS verification and edge network routing.',
  },
  {
    icon: Bot,
    title: 'AI Deployment Assistant',
    description:
      'AI-powered build optimization, failure diagnosis, and deployment recommendations.',
  },
  {
    icon: LineChart,
    title: 'Observability',
    description: 'Metrics, traces, and alerts built-in. Monitor performance from day one.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to ship
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            From first commit to global scale. Built for developers who move fast.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <HoverCard className="h-full">
                <Card className="glass border-border/50 hover:border-primary/30 h-full transition-colors">
                  <CardHeader className="pb-3">
                    <div className="bg-primary/10 mb-3 flex h-9 w-9 items-center justify-center rounded-xl">
                      <feature.icon className="text-primary h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
