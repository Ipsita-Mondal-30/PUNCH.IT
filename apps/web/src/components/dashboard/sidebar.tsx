'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ChevronLeft,
  Globe,
  History,
  LayoutDashboard,
  Menu,
  Rocket,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@punch-it/ui/lib/utils';

const navItems = [
  { href: '/dashboard' as const, label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects' as const, label: 'Projects', icon: Rocket },
  { href: '/dashboard/deployments' as const, label: 'Deployments', icon: History },
  { href: '/dashboard/domains' as const, label: 'Domains', icon: Globe },
  { href: '/dashboard/teams' as const, label: 'Teams', icon: Users },
  { href: '/dashboard/analytics' as const, label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings' as const, label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className="border-border/50 flex h-16 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
            <Zap className="text-primary h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold">
              PUNCH<span className="text-primary">.IT</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground hidden lg:block"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                active
                  ? 'bg-primary/10 text-primary glow-green'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          'glass-strong border-border/50 hidden h-screen shrink-0 flex-col border-r transition-all duration-300 lg:flex',
          collapsed ? 'w-[68px]' : 'w-60',
        )}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-strong border-border/50 fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
