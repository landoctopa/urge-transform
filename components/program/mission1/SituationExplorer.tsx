'use client';

import { useState } from 'react';
import { ArrowRight, Lightbulb, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function SituationExplorer({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [situation, setSituation] = useState(
    typeof saved.situation === 'string'
      ? saved.situation
      : ''
  );

  const [idea, setIdea] = useState(
    typeof saved.idea === 'string'
      ? saved.idea
      : ''
  );

  const [hasIdea, setHasIdea] = useState(
    typeof saved.hasIdea === 'boolean'
      ? saved.hasIdea
      : false
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = situation.trim().length >= 10;

  async function handleSubmit() {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        situation: situation.trim(),
        hasIdea,
        idea: hasIdea ? idea.trim() : '',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <MapPin className="h-4 w-4" />
          Start here
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Where are you right now?
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          There is no right starting point. Maybe you already have an
          idea. Maybe you just know you want to build something.
          Tell us what brought you here.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">
          What's going on?
        </label>

        <Textarea
          value={situation}
          onChange={(event) =>
            setSituation(event.target.value)
          }
          placeholder="I've been thinking about starting something because..."
          className="min-h-[150px] resize-none text-base leading-7"
        />

        <p className="text-xs text-muted-foreground">
          Write it the way you would explain it to a friend.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <button
          type="button"
          onClick={() => setHasIdea((value) => !value)}
          className="flex w-full items-start gap-3 text-left"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
              hasIdea
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border'
            }`}
          >
            {hasIdea ? '✓' : ''}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-primary" />
              I already have an idea
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Good. You don't need to figure out whether it's a
              good idea yet. Just put it on the table.
            </p>
          </div>
        </button>

        {hasIdea && (
          <div className="mt-4">
            <Input
              value={idea}
              onChange={(event) =>
                setIdea(event.target.value)
              }
              placeholder="What is the idea, in one or two sentences?"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canContinue || isSubmitting}
          className="gap-2 rounded-full px-6"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}