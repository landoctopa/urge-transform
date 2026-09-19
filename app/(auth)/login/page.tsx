import Link from 'next/link';

import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            urge
          </Link>

          <div className="mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Welcome back
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
              Let&apos;s get moving.
            </h1>

            <p className="mt-8 max-w-md text-lg leading-8 text-muted-foreground">
              Sign in to continue where you left off.
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}