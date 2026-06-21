'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from '@/lib/query-client';
import { SessionSync } from '@/components/auth/session-sync';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionSync>{children}</SessionSync>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
