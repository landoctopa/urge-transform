'use client';

import { useState } from 'react';

import {
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function CommitmentSynthesis({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [commitment, setCommitment] =
    useState(
      typeof saved.commitment === 'string'
        ? saved.commitment
        : '',
    );

  const [synthesis, setSynthesis] =
    useState<string | null>(
      typeof saved.aiSynthesis === 'string'
        ? saved.aiSynthesis
        : null,
    );

  const [refinedCommitment, setRefinedCommitment] =
    useState(
      typeof saved.refinedCommitment ===
        'string'
        ? saved.refinedCommitment
        : '',
    );

  const [isSynthesizing, setIsSynthesizing] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const canContinue =
    commitment.trim().length >= 3;

  /*
   * -------------------------------------------------------
   * Direct path
   * -------------------------------------------------------
   */
  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onComplete({
        commitment:
          commitment.trim(),

        synthesisMode:
          synthesis
            ? 'ai'
            : 'direct',

        aiSynthesis:
          synthesis,

        refinedCommitment:
          refinedCommitment.trim() ||
          undefined,

        completed: true,
      });
    } catch (error) {
      console.error(
        '[COMMITMENT] Continue error',
        error,
      );

      setError(
        'Something went wrong while saving your commitment. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * -------------------------------------------------------
   * Optional AI synthesis
   * -------------------------------------------------------
   */
  async function handleSynthesize() {
    if (
      !canContinue ||
      isSynthesizing
    ) {
      return;
    }

    setIsSynthesizing(true);
    setError(null);

    try {
      const response = await fetch(
        '/api/program/mission1/commitment',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            commitment:
              commitment.trim(),
          }),
        },
      );

      let data: {
        synthesis?: string;
        suggestedCommitment?: string;
        error?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          'The synthesis service returned an invalid response.',
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ??
            'Unable to synthesize commitment.',
        );
      }

      if (
        !data.synthesis ||
        typeof data.synthesis !==
          'string'
      ) {
        throw new Error(
          'No synthesis was returned.',
        );
      }

      setSynthesis(
        data.synthesis,
      );

      if (
        data.suggestedCommitment &&
        typeof data.suggestedCommitment ===
          'string'
      ) {
        setRefinedCommitment(
          data.suggestedCommitment,
        );
      }
    } catch (error) {
      console.error(
        '[COMMITMENT] Synthesis error',
        error,
      );

      setError(
        'We could not sharpen your commitment right now. You can still continue with your original commitment.',
      );
    } finally {
      setIsSynthesizing(false);
    }
  }

  /*
   * -------------------------------------------------------
   * Continue after synthesis
   * -------------------------------------------------------
   */
  async function handleUseSynthesis() {
    if (
      !canContinue ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onComplete({
        commitment:
          commitment.trim(),

        synthesisMode:
          'ai',

        aiSynthesis:
          synthesis,

        refinedCommitment:
          refinedCommitment.trim() ||
          undefined,

        completed: true,
      });
    } catch (error) {
      console.error(
        '[COMMITMENT] Save error',
        error,
      );

      setError(
        'Something went wrong while saving your commitment. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">

      {/* ------------------------------------------------ */}
      {/* INTRO                                            */}
      {/* ------------------------------------------------ */}

      <div className="space-y-4">

        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Make it real
        </div>

        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What are you committing to?
        </h2>

        <div className="space-y-3 text-sm leading-6 text-muted-foreground sm:text-base">

          <p>
            You've looked at where you are,
            what's holding you back, and what
            you want to change.
          </p>

          <p>
            Now turn that into a commitment you
            can actually act on.
          </p>

          <p>
            It doesn't need to be perfect.
            It needs to be real.
          </p>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* COMMITMENT                                       */}
      {/* ------------------------------------------------ */}

      <div className="rounded-2xl border bg-card p-6 shadow-sm">

        <Textarea
          value={commitment}
          onChange={(event) =>
            setCommitment(
              event.target.value,
            )
          }
          placeholder="I commit to..."
          className="min-h-[170px] resize-none border-0 bg-transparent p-0 text-base leading-7 shadow-none focus-visible:ring-0"
          disabled={
            isSubmitting ||
            Boolean(synthesis)
          }
        />

      </div>

      {/* ------------------------------------------------ */}
      {/* INITIAL ACTIONS                                  */}
      {/* ------------------------------------------------ */}

      <div className="space-y-4">

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Direct */}

          <Button
            onClick={handleContinue}
            disabled={
              !canContinue ||
              isSubmitting ||
              isSynthesizing
            }
            className="gap-2 rounded-full px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Optional synthesis */}

          <Button
            variant="outline"
            onClick={handleSynthesize}
            disabled={
              !canContinue ||
              isSynthesizing ||
              isSubmitting
            }
            className="gap-2 rounded-full px-6"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sharpening...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Help me sharpen this
              </>
            )}
          </Button>

        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Happy with your commitment? Continue.
          Want another perspective before you
          lock it in? We can sharpen it together.
        </p>

      </div>

      {/* ------------------------------------------------ */}
      {/* ERROR                                            */}
      {/* ------------------------------------------------ */}

      {error && (
        <div className="rounded-xl border border-dashed p-4">

          <p className="text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleContinue}
            disabled={
              !canContinue ||
              isSubmitting
            }
            className="mt-2 px-0"
          >
            Continue with my commitment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* AI SYNTHESIS                                     */}
      {/* ------------------------------------------------ */}

      {synthesis && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-7 duration-500">

          <div className="rounded-2xl border bg-primary/5 p-6">

            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">

              <Sparkles className="h-4 w-4" />

              A sharper version

            </div>

            <p className="text-base leading-7">
              {synthesis}
            </p>

          </div>

          {/* Suggested commitment */}

          {refinedCommitment && (
            <div className="space-y-3">

              <label
                htmlFor="refined-commitment"
                className="text-sm font-medium"
              >
                Here's one way you could
                sharpen your commitment
              </label>

              <Textarea
                id="refined-commitment"
                value={
                  refinedCommitment
                }
                onChange={(event) =>
                  setRefinedCommitment(
                    event.target.value,
                  )
                }
                className="min-h-[140px] resize-none text-base leading-7"
                disabled={
                  isSubmitting
                }
              />

              <p className="text-xs leading-5 text-muted-foreground">
                Edit this freely. It is your
                commitment, not the AI's.
              </p>

            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <Button
              onClick={
                handleUseSynthesis
              }
              disabled={
                isSubmitting
              }
              className="gap-2 rounded-full px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Use this commitment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleContinue}
              disabled={
                isSubmitting
              }
              className="rounded-full"
            >
              Keep my original commitment
            </Button>

          </div>

        </div>
      )}

    </div>
  );
}