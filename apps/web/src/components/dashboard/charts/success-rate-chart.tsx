'use client';

import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@punch-it/ui/components/card';

const successRate = 94.2;
const failedRate = 5.8;

export function SuccessRateChart() {
  const circumference = 2 * Math.PI * 45;
  const successOffset = circumference - (successRate / 100) * circumference;

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-medium">Success vs Failed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-red-500/20"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: successOffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{successRate}%</span>
              <span className="text-muted-foreground text-[10px]">Success</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-sm" />
                <span className="text-sm">Successful</span>
              </div>
              <p className="text-muted-foreground ml-4 text-xs">{successRate}%</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-sm bg-red-500/60" />
                <span className="text-sm">Failed</span>
              </div>
              <p className="text-muted-foreground ml-4 text-xs">{failedRate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
