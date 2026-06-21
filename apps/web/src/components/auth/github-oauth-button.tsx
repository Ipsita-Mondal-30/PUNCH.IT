'use client';

import { Github } from 'lucide-react';

import { Button } from '@punch-it/ui/components/button';

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
    <Button size="lg" className={className} onClick={() => signInWithGitHub(callbackURL)}>
      <Github className="h-5 w-5" />
      {label}
    </Button>
  );
}
