'use client';

import { useState } from 'react';

import {
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

interface Mission1Synthesis {
  situation: string;
  motivation: string;
  tension: string;
  pattern: string;
  commitmentQuestion: string;
}

export function CommitmentSynthesis({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [synthesis, setSynthesis] =
    useState<Mission1Synthesis | null>(
      saved.synthesis &&
        typeof saved.synthesis === 'object'
        ? (saved.synthesis as Mission1Synthesis)
        : null,
    );

  const [commitment, setCommitment] =
    useState(
      typeof saved.commitment === 'string'
        ? saved.commitment
        : '',
    );

  const [response, setResponse] =
    useState<
      'yes' | 'not-quite' | null
    >(
      saved.synthesisResponse === 'yes' ||
        saved.synthesisResponse ===
          'not-quite'
        ? saved.synthesisResponse
        : null,
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function generateSynthesis() {
    if (isLoading || synthesis) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      /*
       * The shell currently exposes node progress
       * for the current node. For the prototype we
       * can retrieve the broader mission progress
       * from localStorage.
       *
       * This can later be replaced by the central
       * context manager we designed.
       */
      let storedProgress = null;

      try {
        const raw =
          window.localStorage.getItem(
            'program-progress-mission-1',
          );

        if (raw) {
          storedProgress =
            JSON.parse(raw);
        }
      } catch {
        // Continue with current-node context.
      }

      const response = await fetch(
        '/api/program/mission1/synthesis',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            progress:
              storedProgress ??
              progress,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Unable to generate synthesis',
        );
      }

      const data =
        (await response.json()) as Mission1Synthesis;

      setSynthesis(data);
    } catch (err) {
      console.error(
        '[MISSION1 SYNTHESIS]',
        err,
      );

      setError(
        'We could not generate your synthesis right now. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleComplete() {
    if (
      !synthesis ||
      !response ||
      commitment.trim().length < 3 ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete({
        synthesis,

        synthesisResponse:
          response,

        commitment:
          commitment.trim(),

        completed: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {/* Header */}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="h-4 w-4" />
          Putting it together
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Let's see what we've uncovered.
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          You've looked at what has been holding you
          back, what keeps bringing you back, and what
          you want the future to look like.
        </p>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Before we move on, let's put those pieces
          together.
        </p>
      </div>

      {/* Generate */}

      {!synthesis && (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-muted/30 p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              I'll reflect back the pattern emerging
              from what you've shared. You can decide
              whether it actually fits.
            </p>
          </div>

          <Button
            onClick={generateSynthesis}
            disabled={isLoading}
            className="gap-2 rounded-full px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting the dots...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Show me what you've uncovered
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Synthesis */}

      {synthesis && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-700">
          <div className="space-y-4">
            <SynthesisCard
              label="Where you are"
              text={synthesis.situation}
            />

            <SynthesisCard
              label="What keeps pulling you back"
              text={synthesis.motivation}
            />

            <SynthesisCard
              label="The tension"
              text={synthesis.tension}
            />

            <div className="rounded-2xl border-2 bg-primary/5 p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                The pattern
              </div>

              <p className="text-lg font-medium leading-8">
                {synthesis.pattern}
              </p>
            </div>
          </div>

          {/* Validation */}

          <div className="space-y-3">
            <p className="text-sm font-medium">
              Does this feel like an accurate picture?
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setResponse('yes')
                }
                className={`rounded-xl border p-4 text-left transition ${
                  response === 'yes'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                    {response === 'yes' && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Yes — that feels right
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      You've captured something important.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setResponse('not-quite')
                }
                className={`rounded-xl border p-4 text-left transition ${
                  response === 'not-quite'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                    {response ===
                      'not-quite' && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Not quite
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Something important is missing.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Commitment */}

          {response && (
            <div className="space-y-4">
              <div className="rounded-2xl border p-6">
                <p className="mb-3 text-base font-medium leading-7">
                  {synthesis.commitmentQuestion}
                </p>

                <textarea
                  value={commitment}
                  onChange={(event) =>
                    setCommitment(
                      event.target.value,
                    )
                  }
                  placeholder="My commitment is..."
                  className="min-h-[130px] w-full resize-none rounded-xl border bg-background p-4 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleComplete}
                  disabled={
                    isSubmitting ||
                    commitment.trim()
                      .length < 3
                  }
                  className="gap-2 rounded-full px-6"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : 'Make the commitment'}

                  {!isSubmitting && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SynthesisCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>

      <p className="text-base leading-7">
        {text}
      </p>
    </div>
  );
}