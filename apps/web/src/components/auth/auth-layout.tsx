'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="from-primary/20 via-background to-background absolute inset-0 bg-gradient-to-br" />
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-primary/10 absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-primary/5 absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 glow-green flex h-8 w-8 items-center justify-center rounded-xl">
              <Zap className="text-primary h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">
              PUNCH<span className="text-primary">.IT</span>
            </span>
          </Link>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight"
            >
              Ship code at
              <br />
              <span className="text-primary text-glow">light speed.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mt-4 max-w-md text-lg"
            >
              Join thousands of developers deploying to production in seconds.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
              <Zap className="text-primary h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">
              PUNCH<span className="text-primary">.IT</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
