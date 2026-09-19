export default function DashboardPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Home
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Welcome back.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            See what&apos;s happening, continue your journey,
            and keep moving.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Continue
              </p>

              <h2 className="mt-4 text-2xl font-bold tracking-tight">
                Getting Started
              </h2>

              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Continue your current mission from where you left off.
              </p>

              <button
                type="button"
                className="mt-6 rounded-lg bg-primary px-5 py-3 text-base font-medium text-primary-foreground"
              >
                Continue
              </button>
            </section>

            <section className="rounded-2xl border border-border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Community
              </p>

              <h2 className="mt-4 text-2xl font-bold tracking-tight">
                See what&apos;s happening
              </h2>

              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Discover conversations, people and upcoming events.
              </p>

              <button
                type="button"
                className="mt-6 rounded-lg border border-border px-5 py-3 text-base font-medium"
              >
                Explore
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}