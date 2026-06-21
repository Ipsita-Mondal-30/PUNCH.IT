'use client';

import { useEffect, useState } from 'react';
import { Bell, LogOut, Search, Settings, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@punch-it/ui/components/avatar';
import { Button } from '@punch-it/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@punch-it/ui/components/dropdown-menu';
import { Input } from '@punch-it/ui/components/input';

import { CommandPalette } from '@/components/dashboard/command-palette';
import { signOutUser, useSession } from '@/lib/auth-client';

export function DashboardTopNav() {
  const { data: session } = useSession();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const initials = session?.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <header className="glass-strong border-border/50 sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4 pl-10 lg:pl-0">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="relative hidden w-full max-w-sm sm:block"
          >
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              readOnly
              placeholder="Search projects, deployments..."
              className="bg-background/50 cursor-pointer pl-9"
            />
            <kbd className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="bg-primary absolute right-2 top-2 h-1.5 w-1.5 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0">
                <Avatar className="h-8 w-8">
                  {session?.user.image && (
                    <AvatarImage src={session.user.image} alt={session.user.name ?? 'User'} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{session?.user.name ?? 'User'}</span>
                  <span className="text-muted-foreground text-xs">{session?.user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOutUser();
                  window.location.href = '/';
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
