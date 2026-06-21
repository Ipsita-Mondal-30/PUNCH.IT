'use client';

import { useState } from 'react';

import { Button } from '@punch-it/ui/components/button';

import { signInWithGitHub } from '@/lib/auth-client';

type SignInButtonProps = {
  callbackURL?: string;
  className?: string;
};

export function SignInButton({ callbackURL = '/dashboard', className }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGitHub(callbackURL);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className={className} onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? 'Redirecting…' : 'Sign in with GitHub'}
    </Button>
  );
}
