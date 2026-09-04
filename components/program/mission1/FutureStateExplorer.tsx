'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Telescope,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function FutureStateExplorer({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [future, setFuture] = useState(
    typeof saved.future === 'string'
      ? saved.future
      : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = future.trim().length >= 15;

  async function handleSubmit() {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        future: future.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <Telescope className="h-4 w-4" />
          Look ahead
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          If you actually made this happen, what would be
          different?
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Don't reduce the answer to money. Think about your work,
          your time, your family, the people you could help, or the
          kind of life you could create.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <Textarea
          value={future}
          onChange={(event) =>
            setFuture(event.target.value)
          }
          placeholder="If this worked, my life would be different because..."
          className="min-h-[200px] resize-none text-base leading-7"
        />

        <p className="mt-4 text-xs text-muted-foreground">
          Try to describe the difference, not the business plan.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canContinue || isSubmitting}
          className="gap-2 rounded-full px-6"
        >
          {isSubmitting ? 'Saving...' : 'Picture it'}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}