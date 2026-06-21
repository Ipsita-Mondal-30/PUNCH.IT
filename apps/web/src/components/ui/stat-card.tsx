'use client';

import { type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@punch-it/ui/components/card';
import { cn } from '@punch-it/ui/lib/utils';

import { HoverCard } from '@/components/motion';

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
};

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <HoverCard>
      <Card className={cn('glass border-border/50 hover:glow-green transition-shadow', className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">{title}</p>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              {change && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    changeType === 'positive' && 'text-green-400',
                    changeType === 'negative' && 'text-red-400',
                    changeType === 'neutral' && 'text-muted-foreground',
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
              <Icon className="text-primary h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </HoverCard>
  );
}
