'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Flag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

const QUIT_PATTERNS = [
  'When progress feels too slow',
  'When I get rejected',
  'When I run out of time',
  'When money gets tight',
  'When people around me doubt me',
  'When I start comparing myself to others',
  'When the work becomes boring',
  'When I feel like I am failing',
];

export function QuitConditionExplorer({
  progress,
  onComplete,
}: ProgramComponentProps) {
  const saved = progress.payload ?? {};

  const [selected, setSelected] = useState<string[]>(
    Array.isArray(saved.quitConditions)
      ? saved.quitConditions.filter(
          (value): value is string =>
            typeof value === 'string'
        )
      : []
  );

  const [other, setOther] = useState(
    typeof saved.other === 'string'
      ? saved.other
      : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  const canContinue =
    selected.length > 0 || other.trim().length >= 5;

  async function handleSubmit() {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        quitConditions: selected,
        other: other.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Flag className="h-4 w-4" />
          Be honest
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          When this gets difficult, what are you most likely to do?
        </h2>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          We're not asking what <em>should</em> make you quit.
          We're asking what actually might.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {QUIT_PATTERNS.map((item) => {
          const isSelected = selected.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`rounded-xl border p-4 text-left text-sm transition ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>

                <span>{item}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Anything more specific?
        </label>

        <Textarea
          value={other}
          onChange={(event) =>
            setOther(event.target.value)
          }
          placeholder="The thing most likely to make me walk away is..."
          className="min-h-[110px] resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canContinue || isSubmitting}
          className="gap-2 rounded-full px-6"
        >
          {isSubmitting ? 'Saving...' : 'Keep going'}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}