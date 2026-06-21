'use client';

import Image from 'next/image';

import { Button } from '@punch-it/ui/components/button';

import { signOutUser, useSession } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <span className="text-muted-foreground text-sm">Loading session…</span>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm">
        <p className="font-medium">{session.user.name ?? session.user.email}</p>
        <p className="text-muted-foreground">{session.user.email}</p>
      </div>
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name ?? 'User avatar'}
          width={36}
          height={36}
          className="rounded-full border"
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await signOutUser();
          window.location.href = '/';
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
