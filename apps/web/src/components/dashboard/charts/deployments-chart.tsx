'use client';

import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@punch-it/ui/components/card';

import { deploymentChartData } from '@/lib/mock-data';

export function DeploymentsChart() {
  const maxValue = Math.max(...deploymentChartData.map((d) => d.deployments));

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-medium">Deployments over time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end justify-between gap-2">
          {deploymentChartData.map((day, index) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-col items-center gap-0.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.deployments / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
                  className="bg-primary/80 min-h-[4px] w-full rounded-t-md"
                  style={{ maxHeight: '160px' }}
                />
                {day.failed > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.failed / maxValue) * 100}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                    className="absolute bottom-0 min-h-[2px] w-full rounded-t-md bg-red-500/60"
                    style={{ maxHeight: '20px' }}
                  />
                )}
              </div>
              <span className="text-muted-foreground text-[10px]">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="bg-primary h-2 w-2 rounded-sm" />
            <span className="text-muted-foreground">Successful</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-red-500/60" />
            <span className="text-muted-foreground">Failed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
