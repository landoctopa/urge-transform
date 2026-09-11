// components/discovery/DiscoveryReveal.tsx

'use client';

import type {
  DiscoveryChoice,
  DiscoveryReveal as DiscoveryRevealType,
} from '@/lib/discovery/types';

import {
  ArrowRight,
  Check,
} from 'lucide-react';

interface DiscoveryRevealProps {
  reveal: DiscoveryRevealType;

  onChoose: (
    choice: DiscoveryChoice,
  ) => void;
}

export function DiscoveryReveal({
  reveal,
  onChoose,
}: DiscoveryRevealProps) {
  return (
    <div className="space-y-20">
      {/* ------------------------------------------------
       * Recognition
       * ------------------------------------------------ */}
      <section className="max-w-4xl">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          {reveal.eyebrow}
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
          {reveal.headline}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {reveal.subheadline}
        </p>

        <p className="mt-10 max-w-3xl text-base leading-8 text-foreground/80 sm:text-lg">
          {reveal.recognition}
        </p>
      </section>

      {/* ------------------------------------------------
       * How Urge helps
       * ------------------------------------------------ */}
      <section>
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
            This is where Urge comes in
          </p>

          <p className="mt-4 text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-3xl">
            We help you move through the things that are keeping you from
            starting.
          </p>
        </div>

        <div className="grid border-y border-border">
          {reveal.support.map(
            (item, index) => (
              <div
                key={item.title}
                className="grid gap-4 border-b border-border py-8 last:border-b-0 sm:grid-cols-[64px_220px_1fr] sm:gap-6"
              >
                <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(
                    2,
                    '0',
                  )}
                </span>

                <h2 className="text-lg font-medium tracking-[-0.02em]">
                  {item.title}
                </h2>

                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ------------------------------------------------
       * Urge ecosystem
       * ------------------------------------------------ */}
      <section>
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
            More than a program
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
            You don't build something meaningful from a course alone.
          </h2>

          <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
            {reveal.ecosystemIntro}
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
          {reveal.ecosystem.map(
            (item) => (
              <div
                key={item.title}
                className="bg-background p-7 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium tracking-[-0.015em] sm:text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ------------------------------------------------
       * Closing + actions
       * ------------------------------------------------ */}
      <section className="border-t border-border pt-14">
        <div className="max-w-3xl">
          <p className="text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl">
            {reveal.closing}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Join */}
          <button
            type="button"
            onClick={() =>
              onChoose('join')
            }
            className="group relative overflow-hidden bg-foreground p-7 text-left text-background transition-transform duration-300 hover:-translate-y-1 sm:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-background/50">
                The full experience
              </span>

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Start with Urge
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-6 text-background/65">
                Join the full Urge experience — program, community, live
                sessions, mentors and experts.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Start building
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </button>

          {/* Try */}
          <button
            type="button"
            onClick={() =>
              onChoose('try_first')
            }
            className="group border border-border bg-background p-7 text-left transition-transform duration-300 hover:-translate-y-1 sm:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Start by experiencing it
              </span>

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Try the first mission
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Experience how Urge works before deciding whether you want to
                continue.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Try the first mission
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}