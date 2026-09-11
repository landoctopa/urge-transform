'use client';

import { ArrowRight } from 'lucide-react';
import type { DiscoveryChoice } from '@/lib/discovery/types';

interface DiscoveryChoiceProps {
  onChoose: (
    choice: DiscoveryChoice,
  ) => void;
}

export function DiscoveryChoice({
  onChoose,
}: DiscoveryChoiceProps) {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          Your next move
        </p>

        <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
          You don't have to figure out the whole thing today.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          You just have to decide whether you want to start finding out.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            onChoose('join')
          }
          className="group border border-foreground bg-foreground p-7 text-left text-background transition-transform duration-300 hover:-translate-y-1 sm:p-9"
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-background/50">
              The full experience
            </span>

            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>

          <h2 className="mt-16 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
            Join Urge
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-background/65">
            Get the full program, community, live sessions, mentors, experts
            and everything designed to help you keep moving.
          </p>
        </button>

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

          <h2 className="mt-16 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
            Try the first mission
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Experience how Urge works before deciding whether you want to
            continue.
          </p>
        </button>
      </div>
    </div>
  );
}