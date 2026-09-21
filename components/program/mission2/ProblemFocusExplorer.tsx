'use client';

import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

const FOCUSES = [
  {
    key: 'personal',
    label: 'Personal',
    description:
      'Start with yourself. What keeps annoying you? What do you wish was easier?',
  },
  {
    key: 'expertise',
    label: 'Expertise',
    description:
      "Look at what you already know. What problems do you notice because of what you've spent time doing?",
  },
  {
    key: 'people',
    label: 'People',
    description:
      'Look at the people around you. What do they complain about, struggle with, or work around?',
  },
  {
    key: 'trends',
    label: 'Trends',
    description:
      "Look at what's changing. When something changes, new problems often show up.",
  },
  {
    key: 'world',
    label: 'World',
    description:
      "Look beyond your immediate circle. What problems are people dealing with because of what's happening around them?",
  },
] as const;

const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'A little' },
  { value: 3, label: 'Somewhat' },
  { value: 4, label: 'Quite' },
  { value: 5, label: 'Very' },
] as const;

export function ProblemFocusExplorer({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [focusIndex, setFocusIndex] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(
    typeof saved.mission2ObservationConfidence === 'number'
      ? saved.mission2ObservationConfidence
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focus = FOCUSES[focusIndex];

  function previousFocus() {
    setFocusIndex((current) =>
      current === 0 ? FOCUSES.length - 1 : current - 1,
    );
  }

  function nextFocus() {
    setFocusIndex((current) =>
      current === FOCUSES.length - 1 ? 0 : current + 1,
    );
  }

  async function handleContinue() {
    if (confidence === null || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        mission2ObservationConfidence: confidence,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-12">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">
            Try a different starting point
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Instead of looking for a business idea, try looking for a problem.
          </h1>
        </div>

        <div className="space-y-5 text-base leading-7 text-muted-foreground">
          <p>Think about the businesses you use every day.</p>

          <p>
            Someone couldn&apos;t find something they needed. Something cost
            too much. Something took too long. Something didn&apos;t work very
            well. Something was confusing.
          </p>

          <p>
            Someone had a problem, and a business found a way to solve it.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <p className="text-xl font-semibold leading-8 sm:text-2xl">
            At the root of almost every business opportunity, there is a
            problem.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">
            So where do you look for problems?
          </h2>

          <p className="mt-2 text-muted-foreground">
            Here are a few places you can start.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                {String(focusIndex + 1).padStart(2, '0')} /{' '}
                {String(FOCUSES.length).padStart(2, '0')}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousFocus}
                  aria-label="Previous focus"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={nextFocus}
                  aria-label="Next focus"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-10 min-h-36">
              <h3 className="text-2xl font-semibold">{focus.label}</h3>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {focus.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {FOCUSES.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFocusIndex(index)}
                aria-label={`Show ${item.label}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === focusIndex
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-10">
        <p className="text-xl font-semibold sm:text-2xl">
          How confident do you feel about spotting problems around you?
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setConfidence(level.value)}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                confidence === level.value
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-input text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        disabled={confidence === null || isSubmitting}
      >
        {isSubmitting ? 'Saving...' : "Let's go observe"}
        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}