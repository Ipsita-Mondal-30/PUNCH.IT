'use client';

import { useEffect } from 'react';

import { authClient } from '@/lib/auth-client';

export function SessionSync({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void authClient.getSession();
  }, []);

  return children;
}
