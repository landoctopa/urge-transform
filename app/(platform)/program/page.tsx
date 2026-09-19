import Link from 'next/link';

export default function ProgramPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Your journey
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            You&apos;re in.
          </h1>

          <article className="prose prose-xl mt-10 max-w-3xl">
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
          </article>

          <div className="mt-10">
            <Link
              href="/program/mission/mission-1"
              className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-7 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:h-16 sm:px-8 sm:text-lg"
            >
              Start Mission 1

              <span
                className="ml-3"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>

          <p className="mt-6 text-base leading-7 text-muted-foreground">
            This is the empty-state version of the Program page.
            Later it will be shown only when the member has no
            active program progress.
          </p>
        </div>
      </div>
    </div>
  );
}