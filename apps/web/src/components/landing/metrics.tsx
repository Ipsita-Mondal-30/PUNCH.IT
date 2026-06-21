'use client';

import { StaggerContainer, StaggerItem } from '@/components/motion';

const metrics = [
  { label: 'Deployments', value: '10K+' },
  { label: 'Projects', value: '2K+' },
  { label: 'Uptime', value: '99.99%' },
];

export function MetricsSection() {
  return (
    <section className="border-border/50 border-y py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {metrics.map((metric) => (
            <StaggerItem key={metric.label} className="text-center">
              <p className="text-primary text-glow text-4xl font-bold tracking-tight sm:text-5xl">
                {metric.value}
              </p>
              <p className="text-muted-foreground mt-3 text-base">{metric.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
