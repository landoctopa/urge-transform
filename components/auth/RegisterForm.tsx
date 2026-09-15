'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  initialRegisterState,
  registerAction,
} from '@/lib/auth/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UsernameStatus =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'taken'
  | 'error';

const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,30}$/;

export function RegisterForm() {
  const searchParams = useSearchParams();

  const intent =
    searchParams.get('intent') === 'join'
      ? 'join'
      : 'trial';

  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>('idle');

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialRegisterState,
  );

  async function checkUsername(value: string) {
    const username = value.trim();

    if (!username) {
      setUsernameStatus('idle');
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');

    try {
      const response = await fetch(
        `/api/auth/username?username=${encodeURIComponent(username)}`,
      );

      if (!response.ok) {
        setUsernameStatus('error');
        return;
      }

      const result = await response.json();

      if (!result.valid) {
        setUsernameStatus('invalid');
        return;
      }

      setUsernameStatus(
        result.available ? 'available' : 'taken',
      );
    } catch {
      setUsernameStatus('error');
    }
  }

  useEffect(() => {
    const value = username.trim();

    if (!value || !USERNAME_REGEX.test(value)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void checkUsername(value);
    }, 600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [username]);

  if (state.success) {
    if (state.requiresConfirmation) {
      return (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Almost there
            </p>

            <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              Check your email.
            </h1>

            <p className="max-w-md text-base leading-7 text-muted-foreground">
              We sent you a confirmation link. Confirm your
              email and you’ll be able to continue with Urge.
            </p>
          </div>

          <Link
            href={`/login?intent=${intent}`}
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            You’re in
          </p>

          <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            Let’s begin.
          </h1>

          <p className="text-base leading-7 text-muted-foreground">
            Your account is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="hidden"
        name="intent"
        value={intent}
      />

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
          placeholder="Choose a username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);

            if (
              event.target.value.trim() &&
              !USERNAME_REGEX.test(event.target.value.trim())
            ) {
              setUsernameStatus('invalid');
            } else {
              setUsernameStatus('idle');
            }
          }}
          onBlur={() => {
            void checkUsername(username);
          }}
          required
          minLength={3}
          maxLength={30}
          disabled={isPending}
        />

        <div className="min-h-5 text-xs">
          {usernameStatus === 'invalid' && (
            <p className="text-muted-foreground">
              3–30 characters: letters, numbers, underscores,
              or hyphens.
            </p>
          )}

          {usernameStatus === 'checking' && (
            <p className="text-muted-foreground">
              Checking availability…
            </p>
          )}

          {usernameStatus === 'available' && (
            <p className="text-primary">
              Username available.
            </p>
          )}

          {usernameStatus === 'taken' && (
            <p className="text-destructive">
              That username is already taken.
            </p>
          )}

          {usernameStatus === 'error' && (
            <p className="text-muted-foreground">
              We couldn't check availability right now.
            </p>
          )}
        </div>
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
        {isPending
          ? 'Creating your account…'
          : 'Create account'}
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