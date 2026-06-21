'use client';

import { Github } from 'lucide-react';

import { Button } from '@punch-it/ui/components/button';
import { cn } from '@punch-it/ui/lib/utils';

import { signInWithGitHub } from '@/lib/auth-client';

type GitHubOAuthButtonProps = {
  callbackURL?: string;
  label?: string;
  className?: string;
};

export function GitHubOAuthButton({
  callbackURL = '/dashboard',
  label = 'Continue with GitHub',
  className,
}: GitHubOAuthButtonProps) {
  return (
    <Button
      size="xl"
      variant="glow"
      className={cn('w-full', className)}
      onClick={() => signInWithGitHub(callbackURL)}
    >
      <Github className="h-7 w-7" />
      {label}
    </Button>
  );
}
