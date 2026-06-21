'use client';

import type { ReactNode } from 'react';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardTopNav } from '@/components/dashboard/top-nav';
import { PageTransition } from '@/components/motion';

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="bg-background flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
