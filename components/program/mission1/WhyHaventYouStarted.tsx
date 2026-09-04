'use client';

import { useState } from 'react';

import {
  ArrowRight,
  CircleAlert,
  Loader2,
  MessageCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

const FEARS = [
  'I might fail',
  'Nobody might want it',
  'I might waste money',
  'I might look foolish',
  'People might judge me',
  'I might lose stability',
  'I might discover I am not good enough',
  'I might have to commit for real',
];

interface AIReflection {
  response: string;
  insight?: string;
  followUpQuestion?: string;
}

export function WhyHaventYouStarted({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [answer, setAnswer] = useState(
    typeof saved.answer === 'string'
      ? saved.answer
      : '',
  );

  const [selectedFears, setSelectedFears] =
    useState<string[]>(
      Array.isArray(saved.fears)
        ? saved.fears.filter(
            (value): value is string =>
              typeof value === 'string',
          )
        : [],
    );

  const [reflection, setReflection] =
    useState<AIReflection | null>(
      null,
    );

  const [isReflecting, setIsReflecting] =
    useState(false);

  const [aiError, setAiError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function toggleFear(fear: string) {
    setSelectedFears((current) =>
      current.includes(fear)
        ? current.filter(
            (item) => item !== fear,
          )
        : [...current, fear],
    );
  }

  const canReflect =
    answer.trim().length >= 10 ||
    selectedFears.length > 0;

  async function handleReflect() {
    if (!canReflect || isReflecting) return;

    setIsReflecting(true);
    setAiError(null);

    try {
      const response = await fetch(
        '/api/program/mission1/reflect',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            answer: answer.trim(),
            fears: selectedFears,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Unable to generate reflection',
        );
      }

      const data =
        (await response.json()) as AIReflection;

      setReflection(data);
    } catch (error) {
      console.error(error);

      setAiError(
        'We could not generate the reflection right now. You can still continue.',
      );
    } finally {
      setIsReflecting(false);
    }
  }

  async function handleComplete() {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        answer: answer.trim(),
        fears: selectedFears,

        aiReflection: reflection,

        aiInteractionCompleted:
          Boolean(reflection),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-destructive">
          <CircleAlert className="h-4 w-4" />
          The complication
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Why haven't you started?
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Don't give us the answer you think you're
          supposed to give. What has actually stopped
          you?
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <Textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder="I've been wanting to do this, but..."
          className="min-h-[160px] resize-none text-base leading-7"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">
            Is any of this underneath it?
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Pick anything that feels uncomfortably
            familiar.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {FEARS.map((fear) => {
            const selected =
              selectedFears.includes(fear);

            return (
              <button
                key={fear}
                type="button"
                onClick={() =>
                  toggleFear(fear)
                }
                className={`rounded-xl border p-4 text-left text-sm transition ${
                  selected
                    ? 'border-destructive/40 bg-destructive/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      selected
                        ? 'border-destructive bg-destructive text-destructive-foreground'
                        : 'border-border'
                    }`}
                  >
                    {selected ? '✓' : ''}
                  </div>

                  <span>{fear}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!reflection && (
        <div className="space-y-3">
          <Button
            onClick={handleReflect}
            disabled={
              !canReflect ||
              isReflecting
            }
            className="gap-2 rounded-full px-6"
          >
            {isReflecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking about that...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Help me understand this
              </>
            )}
          </Button>

          {aiError && (
            <p className="text-xs text-muted-foreground">
              {aiError}
            </p>
          )}
        </div>
      )}

      {reflection && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
          <div className="rounded-2xl border bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <MessageCircle className="h-4 w-4" />
              Something worth noticing
            </div>

            <div className="space-y-4">
              <p className="text-base leading-7">
                {reflection.response}
              </p>

              {reflection.insight && (
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium leading-6">
                    {reflection.insight}
                  </p>
                </div>
              )}

              {reflection.followUpQuestion && (
                <p className="text-sm font-medium leading-6">
                  {reflection.followUpQuestion}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-medium">
              Does that feel true?
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              You don't have to agree with the reflection.
              What matters is whether it helps you see
              something more clearly.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="gap-2 rounded-full px-6"
            >
              {isSubmitting
                ? 'Saving...'
                : 'Keep going'}
              {!isSubmitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />

        <span>
          You don't have to solve any of this yet.
          We're just putting a name to what's between
          wanting and doing.
        </span>
      </div>
    </div>
  );
}