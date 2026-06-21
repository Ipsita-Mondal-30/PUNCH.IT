'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@punch-it/ui/components/button';

const terminalLines = [
  { text: '$ git push origin main', delay: 0 },
  { text: 'Building...', delay: 1200 },
  { text: 'Deploying...', delay: 2400 },
  { text: 'Success ✓', delay: 3600, success: true },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers = terminalLines.map((line, index) =>
      setTimeout(() => setVisibleLines(index + 1), line.delay),
    );
    const resetTimer = setTimeout(() => setVisibleLines(0), 6000);
    const loopTimer = setInterval(() => {
      setVisibleLines(0);
      terminalLines.forEach((line, index) => {
        setTimeout(() => setVisibleLines(index + 1), line.delay);
      });
    }, 6500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
      clearInterval(loopTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="gradient-border glow-green-strong relative w-full max-w-lg"
    >
      <div className="bg-card overflow-hidden rounded-xl">
        <div className="border-border/50 flex items-center gap-2 border-b px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-muted-foreground flex flex-1 items-center justify-center gap-1.5 text-xs">
            <Terminal className="h-3 w-3" />
            deployment — bash
          </div>
        </div>
        <div className="bg-[#050505] p-5 font-mono text-sm leading-relaxed">
          {terminalLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={line.success ? 'text-neon-bright text-glow mt-1' : 'text-green-400/90'}
            >
              {line.text}
              {i === visibleLines - 1 && !line.success && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="ml-0.5 inline-block h-4 w-2 bg-green-400"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="from-primary/5 bg-radial pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="border-primary/30 bg-primary/10 text-primary mb-6 inline-flex items-center rounded-xl border px-3 py-1 text-xs font-medium">
                AI-Powered Deployments
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Deploy Anything. <span className="text-primary text-glow">Instantly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground mt-6 max-w-lg text-lg"
            >
              GitHub to Production in Seconds. Ship faster with zero-config deployments, intelligent
              rollbacks, and real-time observability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button size="xl" variant="glow" asChild>
                <Link href="/sign-up">
                  Deploy Now
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="#features">
                  <BookOpen className="h-5 w-5" />
                  View Documentation
                </Link>
              </Button>
            </motion.div>
          </div>

          <AnimatedTerminal />
        </div>
      </div>
    </section>
  );
}
