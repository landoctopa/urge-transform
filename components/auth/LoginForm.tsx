'use client';

import {
  useActionState,
  useState,
} from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {loginAction} from '@/lib/auth/actions';
import {initialLoginState} from '@/lib/auth/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const searchParams = useSearchParams();

  const intent =
    searchParams.get('intent');

  const rawNext =
    searchParams.get('next');

  const next =
    rawNext &&
    rawNext.startsWith('/') &&
    !rawNext.startsWith('//')
      ? rawNext
      : '/dashboard';

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    loginAction,
    initialLoginState,
  );

  const registerHref = intent
    ? `/register?intent=${encodeURIComponent(intent)}`
    : '/register';

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      <input
        type="hidden"
        name="next"
        value={next}
      />

      <div className="space-y-3">
        <label
          htmlFor="email"
          className="block text-sm font-medium"
        >
          Email
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          required
          disabled={isPending}
          className="h-14 text-base sm:h-16"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium"
          >
            Password
          </label>
        </div>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            autoComplete="current-password"
            placeholder="Your password"
            required
            disabled={isPending}
            className="h-14 pr-14 text-base sm:h-16"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (visible) => !visible,
              )
            }
            disabled={isPending}
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
            className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword
              ? 'Hide'
              : 'Show'}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="text-sm leading-6 text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-14 w-full text-base font-medium sm:h-16"
      >
        {isPending
          ? 'Signing you in…'
          : 'Sign in'}
      </Button>

      <p className="text-center text-base leading-7 text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={registerHref}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}