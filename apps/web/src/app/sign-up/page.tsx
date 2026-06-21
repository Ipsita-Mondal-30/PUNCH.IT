import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/auth/auth-layout';
import { GitHubOAuthButton } from '@/components/auth/github-oauth-button';
import { Separator } from '@punch-it/ui/components/separator';

import { getSession } from '@/lib/auth';

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with PUNCH.IT in seconds. No credit card required."
    >
      <GitHubOAuthButton callbackURL="/dashboard" label="Sign up with GitHub" className="w-full" />

      <div className="relative my-6">
        <Separator />
        <span className="bg-background text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs">
          or
        </span>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        Free tier includes 3 projects and 100 deployments per month.
      </p>
    </AuthLayout>
  );
}
