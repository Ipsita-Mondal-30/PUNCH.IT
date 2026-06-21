'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { Badge } from '@punch-it/ui/components/badge';

import { deploymentLogs } from '@/lib/mock-data';

type DeploymentTerminalProps = {
  status?: 'building' | 'deploying' | 'success' | 'failed';
  autoScroll?: boolean;
};

export function DeploymentTerminal({
  status = 'success',
  autoScroll = true,
}: DeploymentTerminalProps) {
  const [visibleLogs, setVisibleLogs] = useState(deploymentLogs.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'building' || status === 'deploying') {
      setVisibleLogs(0);
      const timers = deploymentLogs.map((_, index) =>
        setTimeout(() => setVisibleLogs(index + 1), (index + 1) * 400),
      );
      return () => timers.forEach(clearTimeout);
    }
    setVisibleLogs(deploymentLogs.length);
  }, [status]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs, autoScroll]);

  const statusConfig = {
    building: { label: 'Building', variant: 'warning' as const },
    deploying: { label: 'Deploying', variant: 'info' as const },
    success: { label: 'Ready', variant: 'success' as const },
    failed: { label: 'Failed', variant: 'error' as const },
  };

  return (
    <div className="gradient-border glow-green overflow-hidden rounded-xl">
      <div className="border-border/50 flex items-center justify-between border-b bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-muted-foreground font-mono text-xs">build output</span>
        </div>
        <Badge variant={statusConfig[status].variant} className="font-mono text-[10px]">
          {statusConfig[status].label}
        </Badge>
      </div>

      <div ref={scrollRef} className="h-[480px] overflow-y-auto bg-[#050505]">
        <div className="space-y-0.5 p-4 font-mono text-xs leading-relaxed">
          {deploymentLogs.slice(0, visibleLogs).map((log, index) => (
            <motion.div
              key={`${log.time}-${log.message}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex gap-3"
            >
              <span className="text-muted-foreground/60 shrink-0">{log.time}</span>
              <span
                className={
                  log.level === 'success'
                    ? 'text-neon-bright text-glow'
                    : log.level === 'error'
                      ? 'text-red-400'
                      : 'text-green-400/90'
                }
              >
                {log.message}
              </span>
              {index === visibleLogs - 1 && status !== 'success' && status !== 'failed' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block h-3.5 w-2 bg-green-400"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
