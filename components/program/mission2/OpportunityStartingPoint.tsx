'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function OpportunityStartingPoint({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [answer, setAnswer] = useState(
    typeof saved.mission2StartingPoint === 'string'
      ? saved.mission2StartingPoint
      : '',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = answer.trim().length >= 10;

  async function handleSubmit() {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        mission2StartingPoint: answer.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">
          Let&apos;s start with you
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          You&apos;re ready to take action.
        </h1>

        <div className="space-y-4 text-lg leading-8 text-muted-foreground">
          <p>That&apos;s a big step.</p>
          <p>Now comes the next question.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <label
          htmlFor="mission2-starting-point"
          className="block text-xl font-medium leading-8 sm:text-2xl"
        >
          If you were going to start a business, what would you work on?
        </label>

        <p className="mt-2 text-sm text-muted-foreground">
          Where would you look for a business opportunity?
        </p>

        <Textarea
          id="mission2-starting-point"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Tell us what you&apos;d do..."
          className="mt-6 min-h-36 resize-none"
          disabled={isSubmitting}
        />

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canContinue || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}