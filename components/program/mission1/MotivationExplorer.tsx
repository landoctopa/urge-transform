'use client';

import { useState } from 'react';

import {
  ArrowRight,
  Loader2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

interface MotivationReflection {
  response: string;
  insight?: string;
  followUpQuestion?: string;
}

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
    useState<MotivationReflection | null>(
      saved.aiReflection &&
        typeof saved.aiReflection === 'object'
        ? (saved.aiReflection as MotivationReflection)
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

  const canReflect =
    answer.trim().length >= 10;

  async function handleReflect() {
    if (!canReflect || isReflecting) {
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answer: answer.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Unable to generate reflection',
        );
      }

      const data =
        (await response.json()) as MotivationReflection;

      setReflection(data);
    } catch (err) {
      console.error(
        '[MISSION1 MOTIVATION]',
        err,
      );

      setError(
        'We could not generate the reflection right now. Please try again.',
      );
    } finally {
      setIsReflecting(false);
    }
  }

  async function handleComplete() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete({
        answer: answer.trim(),

        aiReflection: reflection,

        followUp: followUp.trim(),

        aiInteractionCompleted:
          Boolean(reflection),

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
          What is pulling you forward?
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          What has made you give this another shot?
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          You have probably had reasons to walk away.
          Something has kept bringing you back.
        </p>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Don't worry about making it sound impressive.
          Tell us what is genuinely pulling you toward
          this.
        </p>
      </div>

      {/* Initial answer */}

      <div className="rounded-2xl border bg-card p-6">
        <Textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          disabled={Boolean(reflection)}
          placeholder="I keep coming back to this because..."
          className="min-h-[160px] resize-none text-base leading-7"
        />
      </div>

      {/* First AI interaction */}

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
                Let's look underneath that
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

      {/* AI reflection */}

      {reflection && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
          <div className="rounded-2xl border bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <MessageCircle className="h-4 w-4" />
              Let's go one level deeper
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
                <p className="text-base font-medium leading-7">
                  {reflection.followUpQuestion}
                </p>
              )}
            </div>
          </div>

          {/* Follow-up */}

          {reflection.followUpQuestion && (
            <div className="space-y-3">
              <label
                htmlFor="motivation-follow-up"
                className="text-sm font-medium"
              >
                Your answer
              </label>

              <Textarea
                id="motivation-follow-up"
                value={followUp}
                onChange={(event) =>
                  setFollowUp(
                    event.target.value,
                  )
                }
                placeholder="What comes up for you when you think about that?"
                className="min-h-[130px] resize-none"
              />
            </div>
          )}

          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-medium">
              There is no "right" motivation.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              We are trying to understand what actually
              matters to you — not manufacture a better
              answer.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleComplete}
              disabled={
                isSubmitting ||
                (Boolean(
                  reflection.followUpQuestion,
                ) &&
                  followUp.trim().length < 3)
              }
              className="gap-2 rounded-full px-6"
            >
              {isSubmitting
                ? 'Saving...'
                : 'Continue'}

              {!isSubmitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}