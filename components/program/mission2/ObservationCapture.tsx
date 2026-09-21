'use client';

import { useMemo, useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';
import { getObservationDomainConfig } from '@/lib/program/observationConfig';

export function ObservationCapture({
  progress,
  context,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const config = getObservationDomainConfig('problem');

  const [selectedFocus, setSelectedFocus] = useState(
    typeof saved.mission2ObservationFocus === 'string'
      ? saved.mission2ObservationFocus
      : config?.focuses[0]?.key ?? 'personal',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const focus = useMemo(
    () =>
      config?.focuses.find(
        (item) => item.key === selectedFocus,
      ),
    [config, selectedFocus],
  );

  async function handleContinue() {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        mission2ObservationFocus: selectedFocus,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!config || !focus) {
    return (
      <div className="w-full rounded-xl border border-border p-6">
        <p className="text-sm text-muted-foreground">
          Observation configuration is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">
          Go look
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          What can you notice?
        </h1>

        <p className="text-base leading-7 text-muted-foreground">
          Pick a place to look. We&apos;ll give you a little guidance,
          but don&apos;t overthink it. Just pay attention to things that
          don&apos;t work, feel harder than they should, or make people
          think, &ldquo;Why is this so difficult?&rdquo;
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="observation-focus"
          className="text-sm font-medium"
        >
          Where do you want to look?
        </label>

        <select
          id="observation-focus"
          value={selectedFocus}
          onChange={(event) =>
            setSelectedFocus(event.target.value)
          }
          className="w-full rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {config.focuses.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-border bg-secondary p-5 sm:p-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            {focus.label}
          </p>

          <p className="text-base font-medium leading-7">
            {focus.prompt}
          </p>

          <p className="text-sm leading-6 text-muted-foreground">
            {focus.guidance}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-lg font-semibold">
            Your observations
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Capture anything that makes you stop and think.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your observations will appear here.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full"
          onClick={() => {
            // ObservationForm will be connected here.
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add observation
        </Button>
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
        {!isSubmitting && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}