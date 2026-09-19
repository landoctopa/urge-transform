import { requireCurrentUser } from '@/lib/auth/currentUser';

export default async function ProgramWelcomePage() {
  await requireCurrentUser();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="space-y-24">
          {/* Page title */}
          <section className="max-w-4xl">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Typography Playground
            </p>

            <h1 className="text-6xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              This is deliberately big.
            </h1>

            <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
              Page titles remain under our direct control.
              Content typography is now handled by Tailwind Typography.
            </p>
          </section>

          {/* Prose XL */}
          <section>
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              01 — Prose XL
            </p>

            <article className="prose prose-xl max-w-3xl">
              <p>
                This paragraph is using <strong>prose-xl</strong>.
                We are deliberately not specifying the font size,
                line height, paragraph spacing, or text color ourselves.
              </p>

              <p>
                The Typography plugin is responsible for establishing
                the reading experience. This is important because Urge
                will contain a lot of content that people need to read,
                understand and act on.
              </p>

              <p>
                The goal is comfortable reading rather than fitting
                as much information as possible onto the screen.
              </p>
            </article>
          </section>

          {/* Headings */}
          <section>
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              02 — Prose Headings
            </p>

            <article className="prose prose-xl max-w-3xl">
              <h1>Start before you are ready.</h1>

              <p>
                You don't need to have everything figured out before
                you begin.
              </p>

              <h2>What matters is starting.</h2>

              <p>
                Starting gives you something real to investigate.
                It creates evidence, questions and opportunities to learn.
              </p>

              <h3>Don't wait for certainty.</h3>

              <p>
                The work is to move forward, observe what happens
                and use what you learn to decide what to do next.
              </p>
            </article>
          </section>

          {/* Lists */}
          <section>
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              03 — Lists
            </p>

            <article className="prose prose-xl max-w-3xl">
              <p>
                During a mission, you might need to:
              </p>

              <ul>
                <li>Notice something that could be better.</li>
                <li>Talk to people experiencing the problem.</li>
                <li>Ask questions instead of making assumptions.</li>
                <li>Try something small.</li>
                <li>Observe what happens.</li>
                <li>Decide what to investigate next.</li>
              </ul>
            </article>
          </section>

          {/* Emphasis and links */}
          <section>
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              04 — Rich Content
            </p>

            <article className="prose prose-xl max-w-3xl">
              <p>
                Sometimes the most important thing you can do is
                <strong> ask a question you are uncomfortable asking.</strong>
              </p>

              <p>
                You are not trying to prove that your idea is right.
                You are trying to find out what is actually true.
              </p>

              <blockquote>
                <p>
                  Start with what you can observe, not what you hope
                  is true.
                </p>
              </blockquote>

              <p>
                You can also explore{' '}
                <a href="#">
                  additional resources
                </a>{' '}
                when you need more context.
              </p>
            </article>
          </section>

          {/* Final test */}
          <section className="border-t border-border pt-16 sm:pt-24">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Final Test
            </p>

            <h2 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              What if starting
              <br />
              was the point?
            </h2>

            <article className="prose prose-xl mt-10 max-w-3xl">
              <p>
                This paragraph is deliberately using only
                <strong> prose-xl</strong>. If this feels comfortable
                to read, we may have found the right foundation for
                Urge&apos;s program content.
              </p>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}