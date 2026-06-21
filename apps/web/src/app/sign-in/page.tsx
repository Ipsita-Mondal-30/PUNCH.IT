import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/auth/auth-layout';
import { GitHubOAuthButton } from '@/components/auth/github-oauth-button';
import { Separator } from '@punch-it/ui/components/separator';

import { getSession } from '@/lib/auth';

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getSession();
  const { callbackUrl = '/dashboard' } = await searchParams;

  if (session) {
    redirect(callbackUrl as '/dashboard');
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your deployments and projects.">
      <GitHubOAuthButton callbackURL={callbackUrl} className="w-full" />

      <div className="relative my-6">
        <Separator />
        <span className="bg-background text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs">
          or
        </span>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary hover:underline">
          Create one
        </Link>
      </p>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  );
}
