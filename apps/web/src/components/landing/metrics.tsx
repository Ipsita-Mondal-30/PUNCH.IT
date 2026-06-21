'use client';

import { StaggerContainer, StaggerItem } from '@/components/motion';

const metrics = [
  { label: 'Deployments', value: '10K+' },
  { label: 'Projects', value: '2K+' },
  { label: 'Uptime', value: '99.99%' },
  { label: 'Developers', value: '5K+' },
];

export function MetricsSection() {
  return (
    <section className="border-border/50 border-y py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric) => (
            <StaggerItem key={metric.label} className="text-center">
              <p className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
                {metric.value}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{metric.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
