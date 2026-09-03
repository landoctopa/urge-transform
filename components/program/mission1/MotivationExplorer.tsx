'use client';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function MotivationExplorer({
  node,
  onComplete,
}: ProgramComponentProps) {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-3xl font-semibold">
        {node.title}
      </h2>

      <p className="text-muted-foreground">
        Motivation Explorer scaffold.
      </p>

      <button
        onClick={() => onComplete()}
        className="rounded-lg bg-primary px-5 py-3 text-primary-foreground"
      >
        Continue
      </button>
    </section>
  );
}