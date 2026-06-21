'use client';

import { Github, Hammer, Rocket, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

import { FadeIn } from '@/components/motion';

const steps = [
  { icon: Github, label: 'GitHub', description: 'Push your code' },
  { icon: Hammer, label: 'Build', description: 'Auto-detect & compile' },
  { icon: Rocket, label: 'Deploy', description: 'Edge network push' },
  { icon: Globe, label: 'Live', description: 'Global availability' },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="border-border/50 border-y py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Push to production in four steps
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            A streamlined pipeline from commit to global deployment.
          </p>
        </FadeIn>

        <div className="relative mx-auto max-w-3xl">
          <div className="from-primary/50 via-primary/20 absolute left-[10%] right-[10%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r to-transparent md:block" />

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {steps.map((step, index) => (
              <FadeIn key={step.label} className="relative flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.4 }}
                  className="gradient-border glow-green relative mb-4"
                >
                  <div className="bg-card flex h-14 w-14 items-center justify-center rounded-xl">
                    <step.icon className="text-primary h-6 w-6" />
                  </div>
                </motion.div>
                <h3 className="font-semibold">{step.label}</h3>
                <p className="text-muted-foreground mt-1 text-xs">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="text-primary/40 mt-4 text-xl md:hidden">↓</div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
