'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { registerAction } from '@/lib/auth/actions';
import { initialRegisterState } from '@/lib/auth/types';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const rawIntent = searchParams.get('intent');
  const intent: 'join' | 'trial' = rawIntent === 'join' ? 'join' : 'trial';

  const [state, formAction, isPending,] = useActionState(registerAction, initialRegisterState,);

  if (
    state.success &&
    state.requiresConfirmation
  ) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
            Almost there
          </p>

          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
            Check your email.
          </h1>

          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            We&apos;ve sent you a confirmation link.
            Confirm your email and we&apos;ll bring you
            straight back to Urge to finish setting up
            your profile.
          </p>

          <div className="border-t border-border pt-8">
            <p className="text-sm leading-6 text-muted-foreground">
              Your chosen path will be preserved, so you
              won&apos;t have to start over.
            </p>
          </div>

          <Link
            href={`/login?intent=${intent}`}
            className="inline-flex text-sm font-medium underline underline-offset-4"
          >
            Already confirmed? Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          You&apos;re in
        </p>

        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
          Let&apos;s begin.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Your account is ready. Let&apos;s finish setting
          up your Urge profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-10">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          Create your account
        </p>

        <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
          Let&apos;s get you started.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Create your account first. We&apos;ll set up the
          rest of your Urge profile next.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-8"
      >
        <input
          type="hidden"
          name="intent"
          value={intent}
        />

        <div>
          <label
            htmlFor="email"
            className="mb-3 block text-sm font-medium"
          >
            Email
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            className="h-14 sm:h-16"
          />
        </div>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={isPending}
            className="h-14 pr-14 sm:h-16"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((visible) => !visible)
            }
            disabled={isPending}
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
            className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        </div>




        {state.error && (
          <p
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-14 w-full rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16"
        >
          {isPending
            ? 'Creating your account…'
            : 'Create account'}
        </button>
      </form>
    </div>
  );
}