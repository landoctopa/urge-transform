'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { registerAction, initialRegisterState } from '@/lib/auth/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const searchParams = useSearchParams();

  const intent = searchParams.get('intent') === 'join'
    ? 'join'
    : 'trial';

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialRegisterState,
  );

  if (state.success) {
    if (state.requiresConfirmation) {
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Almost there
            </p>

            <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              Check your email.
            </h1>

            <p className="max-w-md text-base leading-7 text-muted-foreground">
              We sent you a confirmation link. Confirm your email and
              you’ll be able to continue with Urge.
            </p>
          </div>

          <Link
            href="/login"
            className="text-sm font-medium underline underline-offset-4"
          >
            Already confirmed? Sign in
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            You’re in
          </p>

          <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            Let’s begin.
          </h1>
        </div>

        <p className="text-base leading-7 text-muted-foreground">
          Your account is ready.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="intent" value={intent} />

      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium"
        >
          Username
        </label>

        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="How should we know you?"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Password
        </label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
          disabled={isPending}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        className="h-12 w-full text-sm font-medium"
        disabled={isPending}
      >
        {isPending ? 'Creating your account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/login?intent=${intent}`}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}