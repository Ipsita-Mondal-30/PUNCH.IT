import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';

import { getSession } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in?callbackUrl=/dashboard');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
