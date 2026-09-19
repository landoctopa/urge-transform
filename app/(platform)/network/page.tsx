export default function NetworkPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Network
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Meet people
            <br />
            worth knowing.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            Find founders, experts and people working on
            interesting problems.
          </p>

          <div className="mt-10 flex max-w-3xl items-center gap-3 rounded-xl border border-border px-4 py-3">
            <input
              type="search"
              placeholder="Search people..."
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground"
            >
              Search
            </button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Maya',
              'Rohan',
              'Ananya',
              'Karan',
              'Priya',
              'Vikram',
            ].map((name) => (
              <article
                key={name}
                className="rounded-2xl border border-border p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-muted" />

                  <div>
                    <h2 className="text-lg font-semibold">
                      {name}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Founder
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Exploring problems around customers, work
                  and everyday business.
                </p>

                <button
                  type="button"
                  className="mt-5 text-base font-medium text-primary"
                >
                  View profile →
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}