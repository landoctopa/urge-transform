# Fix onboarding issues
1. Program hydration error : This we have resolved
2. Avatar upload — storage RLS - have to do
3. Issues in ProfileCompletionForm
    - Currency preselection
    - Username availability: This should be a semantic success state, not the Urge brand color.
    - Mobile number : 
    - Display success message after the form is submitted and then take users to checkout directly instead of going through success page.
    - offer pricing -> Quarterly should be the default
4. remove app/(platform)/profile/complete/success/page.tsx
5. Welcome → Mission 1: fixed
6. Password show/hide alignment in app/register/page.tsx
7. stringified metadata (rpc check)

## Relevant files
1. components/auth/ProfileCompletionForm.tsx (attached)
2. app/register/page.tsx
```tsx
import Link from 'next/link';

import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <section className="hidden flex-1 border-r border-border lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <Link
            href="/"
            className="text-xl font-medium tracking-[-0.04em]"
          >
            urge
          </Link>

          <div className="max-w-xl pb-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Start here
            </p>

            <h2 className="text-5xl font-medium leading-[0.95] tracking-[-0.06em] xl:text-6xl">
              You don’t need to be ready.
            </h2>

            <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
              You just need to be willing to move.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Urge
          </p>
        </section>

        <section className="flex w-full items-center px-6 py-12 sm:px-10 lg:w-[520px] lg:px-14 xl:w-[560px]">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="text-xl font-medium tracking-[-0.04em]"
              >
                urge
              </Link>
            </div>

            <div className="mb-10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Create your account
              </p>

              <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                Start with yourself.
              </h1>

              <p className="text-sm leading-6 text-muted-foreground">
                A few details. Then we get to the part that
                matters.
              </p>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}

```
3. app/(platform)/profile/complete/success/page.tsx
```tsx
import Link from 'next/link';

interface ProfileCompleteSuccessPageProps {
  searchParams: Promise<{
    intent?: string;
  }>;
}

export default async function ProfileCompleteSuccessPage({
  searchParams,
}: ProfileCompleteSuccessPageProps) {
  const params = await searchParams;

  const intent =
    params.intent === 'join'
      ? 'join'
      : 'trial';

  const continueHref =
    intent === 'join'
      ? '/checkout?offering=urge-membership'
      : '/program/welcome?intent=trial';

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          You&apos;re ready
        </p>

        <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
          Your profile is set up.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
          {intent === 'join'
            ? 'Your account is ready. The next step is to complete your Urge membership.'
            : 'Your account is ready. The next step is to start your Urge experience.'}
        </p>

        <div className="mt-10">
          <Link
            href={continueHref}
            className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}

```
4. Register Form Attached