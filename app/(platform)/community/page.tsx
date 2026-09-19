export default function CommunityPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <main className="min-w-0 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Community
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              What people are
              <br />
              figuring out.
            </h1>

            <section className="mt-10 rounded-2xl border border-border p-5">
              <p className="text-lg font-medium">
                What are you working on?
              </p>

              <div className="mt-4 rounded-xl bg-muted p-4 text-base text-muted-foreground">
                Start a conversation...
              </div>
            </section>

            <div className="mt-8 space-y-8">
              <article className="border-b border-border pb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />

                  <div>
                    <p className="text-base font-semibold">
                      Maya
                    </p>

                    <p className="text-sm text-muted-foreground">
                      28 minutes ago
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xl leading-8">
                  I spoke to three people about the problem
                  I&apos;ve been thinking about and learned that
                  I had completely misunderstood what bothered them.
                </p>

                <div className="mt-5 flex gap-5 text-sm text-muted-foreground">
                  <button>Reply</button>
                  <button>Like</button>
                  <button>Save</button>
                </div>
              </article>

              <article className="border-b border-border pb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />

                  <div>
                    <p className="text-base font-semibold">
                      Rohan
                    </p>

                    <p className="text-sm text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xl leading-8">
                  What is the smallest version of the thing
                  you&apos;re trying to build that someone would
                  actually pay for?
                </p>

                <div className="mt-5 flex gap-5 text-sm text-muted-foreground">
                  <button>Reply</button>
                  <button>Like</button>
                  <button>Save</button>
                </div>
              </article>
            </div>
          </main>

          <aside className="xl:sticky xl:top-8 xl:self-start">
            <div className="space-y-5">
              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Community insights
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-sm text-muted-foreground">
                      people active this week
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">
                      conversations started
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">9</p>
                    <p className="text-sm text-muted-foreground">
                      events coming up
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Happening now
                </p>

                <div className="mt-4 space-y-5">
                  <div>
                    <p className="text-base font-semibold">
                      How are you finding your first customers?
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      18 replies
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold">
                      Share what you&apos;re testing this week
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      11 replies
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}