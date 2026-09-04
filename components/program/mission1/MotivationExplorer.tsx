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

export function MotivationExplorer({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [answer, setAnswer] = useState(
    typeof saved.answer === 'string'
      ? saved.answer
      : '',
  );

  const [reflection, setReflection] =
    useState<string | null>(
      typeof saved.aiReflection === 'string'
        ? saved.aiReflection
        : null,
    );

  const [followUp, setFollowUp] =
    useState(
      typeof saved.followUp === 'string'
        ? saved.followUp
        : '',
    );

  const [isReflecting, setIsReflecting] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const canContinue =
    answer.trim().length >= 3;

  /*
   * -------------------------------------------------------
   * Direct path
   * -------------------------------------------------------
   *
   * The user doesn't need AI to proceed.
   */
  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onComplete({
        answer: answer.trim(),

        explorationMode:
          reflection
            ? 'reflection'
            : 'direct',

        aiReflection:
          reflection,

        followUp:
          followUp.trim() || undefined,

        completed: true,
      });
    } catch (error) {
      console.error(
        '[MOTIVATION] Continue error',
        error,
      );

      setError(
        'Something went wrong while saving your response. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * -------------------------------------------------------
   * Optional AI enrichment
   * -------------------------------------------------------
   */
  async function handleReflect() {
    if (!canContinue || isReflecting) {
      return;
    }

    setIsReflecting(true);
    setError(null);

    try {
      const response = await fetch(
        '/api/program/mission1/motivation',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            answer: answer.trim(),
          }),
        },
      );

      let data: {
        reflection?: string;
        error?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          'The reflection service returned an invalid response.',
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ??
            'Unable to generate reflection.',
        );
      }

      if (
        !data.reflection ||
        typeof data.reflection !==
          'string'
      ) {
        throw new Error(
          'No reflection was returned.',
        );
      }

      setReflection(
        data.reflection,
      );
    } catch (error) {
      console.error(
        '[MOTIVATION] Reflection error',
        error,
      );

      setError(
        'We could not generate a reflection right now. You can still continue without it.',
      );
    } finally {
      setIsReflecting(false);
    }
  }

  /*
   * -------------------------------------------------------
   * Continue after optional reflection
   * -------------------------------------------------------
   */
  async function handleContinueWithReflection() {
    if (!canContinue || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onComplete({
        answer: answer.trim(),

        explorationMode:
          'reflection',

        aiReflection:
          reflection,

        followUp:
          followUp.trim() || undefined,

        completed: true,
      });
    } catch (error) {
      console.error(
        '[MOTIVATION] Save error',
        error,
      );

      setError(
        'Something went wrong while saving your response. Please try again.',
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
          There's a reason you're here
        </div>

        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What made you give this another shot?
        </h2>

        <div className="space-y-3 text-sm leading-6 text-muted-foreground sm:text-base">

          <p>
            You've thought about this before.
            Maybe you've even tried to start.
          </p>

          <p>
            But something brought you back.
          </p>

          <p>
            What is it?
          </p>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* ANSWER                                           */}
      {/* ------------------------------------------------ */}

      <div className="rounded-2xl border bg-card p-6 shadow-sm">

        <Textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder="I'm giving this another shot because..."
          className="min-h-[170px] resize-none border-0 bg-transparent p-0 text-base leading-7 shadow-none focus-visible:ring-0"
          disabled={isSubmitting}
        />

      </div>

      {/* ------------------------------------------------ */}
      {/* INITIAL ACTIONS                                  */}
      {/* ------------------------------------------------ */}

      <div className="space-y-4">

        <div className="flex flex-col gap-3 sm:flex-row">

          <Button
            onClick={handleContinue}
            disabled={
              !canContinue ||
              isSubmitting ||
              isReflecting
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

          <Button
            variant="outline"
            onClick={handleReflect}
            disabled={
              !canContinue ||
              isReflecting ||
              isSubmitting
            }
            className="gap-2 rounded-full px-6"
          >
            {isReflecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exploring...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Help me explore this
              </>
            )}
          </Button>

        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Already know what brought you back?
          Continue. Want to understand it a little
          better? Explore it with us.
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

        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* OPTIONAL AI REFLECTION                           */}
      {/* ------------------------------------------------ */}

      {reflection && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-7 duration-500">

          <div className="rounded-2xl border bg-primary/5 p-6">

            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">

              <Sparkles className="h-4 w-4" />

              Something worth noticing

            </div>

            <p className="text-base leading-7">
              {reflection}
            </p>

          </div>

          {/* Follow-up remains optional */}

          <div className="space-y-3">

            <label
              htmlFor="motivation-follow-up"
              className="text-sm font-medium"
            >
              Does that resonate?
            </label>

            <Textarea
              id="motivation-follow-up"
              value={followUp}
              onChange={(event) =>
                setFollowUp(
                  event.target.value,
                )
              }
              placeholder="What comes up for me is..."
              className="min-h-[130px] resize-none text-base leading-7"
              disabled={isSubmitting}
            />

            <p className="text-xs leading-5 text-muted-foreground">
              You can leave this blank if you
              don't have anything else to add.
            </p>

          </div>

          {/* Reflection branch */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <Button
              onClick={
                handleContinueWithReflection
              }
              disabled={isSubmitting}
              className="gap-2 rounded-full px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue with this reflection
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleContinue}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Continue without going deeper
            </Button>

          </div>

        </div>
      )}

    </div>
  );
}