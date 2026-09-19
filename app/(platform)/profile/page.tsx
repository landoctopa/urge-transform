export default function ProfilePage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Profile
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-24 w-24 rounded-full bg-muted" />

            <div>
              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Amit
              </h1>

              <p className="mt-3 text-xl leading-8 text-muted-foreground">
                Founder · Designer · Builder
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-5">
            <section className="rounded-2xl border border-border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                About
              </p>

              <p className="mt-4 max-w-3xl text-lg leading-8">
                Building things, exploring problems and helping
                people turn ideas into action.
              </p>
            </section>

            <section className="rounded-2xl border border-border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Skills
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Design',
                  'Strategy',
                  'Technology',
                  'Entrepreneurship',
                  'Product',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-muted px-4 py-2 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <button
              type="button"
              className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground"
            >
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}