import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            urge
          </Link>

          <Link
            href="/discover"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Explore Urge
          </Link>
        </header>

        <section className="flex flex-1 items-center py-20">
          <div className="max-w-4xl space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              For people who want to move
            </p>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
              You know there&apos;s something
              more.
              <br />
              <span className="text-muted-foreground">
                Let&apos;s figure out what it is.
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Urge helps you turn uncertainty into
              movement — by understanding what matters,
              exploring what could be next, and taking
              action before you have everything figured
              out.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Find out if Urge is for you
              </Link>

              <Link
                href="/program/mission/mission-1"
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 font-medium transition hover:bg-muted"
              >
                Program preview
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}