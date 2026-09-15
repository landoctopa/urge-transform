'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import { registerAction } from '@/lib/auth/actions';

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

const initialState = {
  error: null,
  success: false,
  requiresConfirmation: false,
};

export function RegisterForm() {
  const searchParams = useSearchParams();

  const rawIntent = searchParams.get('intent');

  const intent: 'join' | 'trial' =
    rawIntent === 'join' ? 'join' : 'trial';

  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>('idle');

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
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

  /*
   * Email confirmation state
   */
  if (state.success) {
    if (state.requiresConfirmation) {
      return (
        <div className="space-y-10">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Almost there
            </p>

            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Check your email.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              We sent you a confirmation link. Confirm your
              email and you’ll be able to continue with Urge.
            </p>
          </div>

          <Link
            href={`/login?intent=${intent}`}
            className="text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Already confirmed? Sign in
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            You’re in
          </p>

          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Let’s begin.
          </h1>

          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
            Your account is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      <input
        type="hidden"
        name="intent"
        value={intent}
      />

      {/* Username */}
      <div className="space-y-3">
        <label
          htmlFor="username"
          className="text-sm font-medium sm:text-base"
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
              !USERNAME_REGEX.test(
                event.target.value.trim(),
              )
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
          className="h-14 text-base sm:h-16 sm:text-lg"
        />

        <div className="min-h-6 text-sm">
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

      {/* Email */}
      <div className="space-y-3">
        <label
          htmlFor="email"
          className="text-sm font-medium sm:text-base"
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
          className="h-14 text-base sm:h-16 sm:text-lg"
        />
      </div>

      {/* Password */}
      <div className="space-y-3">
        <label
          htmlFor="password"
          className="text-sm font-medium sm:text-base"
        >
          Password
        </label>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            disabled={isPending}
            className="h-14 pr-12 text-base sm:h-16 sm:pr-14 sm:text-lg"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:w-14"
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          At least 8 characters.
        </p>
      </div>

      {/* Server error */}
      {state.error && (
        <p
          role="alert"
          className="text-base leading-7 text-destructive"
        >
          {state.error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="h-14 w-full text-base font-medium sm:h-16 sm:text-lg"
        disabled={isPending}
      >
        {isPending
          ? 'Creating your account…'
          : 'Create account'}
      </Button>

      {/* Login */}
      <p className="text-center text-base leading-7 text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/login?intent=${intent}`}
          className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}