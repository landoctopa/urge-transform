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
                A few details. Then we get to the part that matters.
              </p>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}