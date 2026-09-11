'use client';

import type { DiscoveryReveal as DiscoveryRevealType } from '@/lib/discovery/types';
import { ArrowRight } from 'lucide-react';

interface DiscoveryRevealProps {
  reveal: DiscoveryRevealType;
  onContinue: () => void;
}

export function DiscoveryReveal({
  reveal,
  onContinue,
}: DiscoveryRevealProps) {
  return (
    <div className="space-y-14">
      <div className="max-w-4xl">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          {reveal.eyebrow}
        </p>

        <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
          {reveal.headline}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {reveal.subheadline}
        </p>
      </div>

      <div className="grid border-y border-border">
        {reveal.reasons.map(
          (reason, index) => (
            <div
              key={reason.title}
              className="grid gap-5 border-b border-border py-8 last:border-b-0 sm:grid-cols-[80px_220px_1fr] sm:items-start"
            >
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(
                  2,
                  '0',
                )}
              </span>

              <h2 className="text-lg font-medium tracking-[-0.02em]">
                {reason.title}
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {reason.description}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="max-w-3xl">
        <p className="text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-3xl">
          {reveal.closing}
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
        >
          See what Urge looks like
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}