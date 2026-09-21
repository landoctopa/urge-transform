'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function OpportunityComplication({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const startingPoint =
    typeof saved.mission2StartingPoint === 'string'
      ? saved.mission2StartingPoint
      : '';

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        acknowledged: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">
          Let&apos;s look at that
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          So, where are you going to find a business opportunity?
        </h1>
      </div>

      {startingPoint && (
        <div className="rounded-xl border border-border bg-secondary p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            You said
          </p>

          <p className="mt-3 text-base leading-7 text-secondary-foreground">
            {startingPoint}
          </p>
        </div>
      )}

      <div className="space-y-5">
        <p className="text-base leading-7 text-muted-foreground">
          That may be a good place to start. But there&apos;s a question worth
          asking:
        </p>

        <div className="rounded-xl bg-secondary p-6 sm:p-8">
          <p className="text-xl font-medium leading-8 sm:text-2xl">
            How would you know whether there&apos;s a real problem behind the
            opportunity?
          </p>
        </div>
      </div>

      <div>
        <p className="text-base leading-7 text-muted-foreground">
          Maybe there&apos;s another way to look for opportunities.
        </p>

        <Button
          type="button"
          className="mt-8"
          onClick={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Let’s see'}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}