import Link from 'next/link';

import { requireCurrentUser } from '@/lib/auth/currentUser';

export default async function ProgramWelcomePage() {
  await requireCurrentUser();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16 sm:px-8 sm:py-24">
        <div className="w-full">
          <div className="max-w-2xl">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              Welcome to Urge
            </p>

            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              You&apos;re in.
            </h1>

            <div className="mt-8 max-w-xl space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
              <p>
                You don&apos;t need to have it all figured out.
                You don&apos;t need a perfect idea.
                You don&apos;t need to know exactly what you&apos;re doing.
              </p>

              <p>
                You just need to be willing to start.
              </p>

              <p>
                Urge will take you through a series of missions.
                Each one will help you think, investigate, act and
                learn — until you have something real to work with.
              </p>

              <p>
                This isn&apos;t a course to complete.
                It&apos;s a journey to take.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/program/mission/1"
                className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-7 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:h-16 sm:px-8 sm:text-lg"
              >
                Start Mission 1
                <span className="ml-3" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              You can take this at your own pace. What matters is
              that you keep moving.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}