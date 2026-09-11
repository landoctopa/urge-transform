'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DISCOVERY_HURDLES,
  DISCOVERY_SITUATIONS,
} from '@/lib/discovery/constants';

import {
  createDiscoveryState,
  loadDiscoveryState,
  saveDiscoveryState,
  setHurdle,
  setSituation,
} from '@/lib/discovery/state';

import {
  getDiscoveryReveal,
} from '@/lib/discovery/recommendations';

import type {
  DiscoveryChoice,
  DiscoveryState,
  DiscoveryStep,
} from '@/lib/discovery/types';

import { DiscoverySituation } from './DiscoverySituation';
import { DiscoveryHurdle } from './DiscoveryHurdle';
import { DiscoveryReveal } from './DiscoveryReveal';
import { DiscoveryChoice as DiscoveryChoiceView } from './DiscoveryChoice';

const STEPS: DiscoveryStep[] = [
  'situation',
  'hurdle',
  'reveal',
  'choice',
];

export function DiscoveryFlow() {
  const [state, setState] =
    useState<DiscoveryState | null>(null);

  const [step, setStep] =
    useState<DiscoveryStep>('situation');

  const [selectedChoice, setSelectedChoice] =
    useState<DiscoveryChoice | null>(null);

  const [ready, setReady] =
    useState(false);

  /*
   * Restore anonymous discovery state.
   *
   * Discovery is independent of Program state.
   */
  useEffect(() => {
    const stored =
      loadDiscoveryState();

    if (stored) {
      setState(stored);

      if (stored.hurdle) {
        setStep('reveal');
      } else if (stored.situation) {
        setStep('hurdle');
      }
    } else {
      setState(
        createDiscoveryState(),
      );
    }

    setReady(true);
  }, []);

  /*
   * Persist discovery independently.
   */
  useEffect(() => {
    if (!state) {
      return;
    }

    saveDiscoveryState(state);
  }, [state]);

  const currentIndex =
    useMemo(
      () =>
        STEPS.indexOf(step),
      [step],
    );

  const progress =
    ((currentIndex + 1) /
      STEPS.length) *
    100;

  const reveal =
    state?.situation &&
    state?.hurdle
      ? getDiscoveryReveal(
          state.situation,
          state.hurdle,
        )
      : null;

  const chooseSituation =
    useCallback(
      (
        value: NonNullable<
          DiscoveryState['situation']
        >,
      ) => {
        setState((current) => {
          if (!current) {
            return null;
          }

          return setSituation(
            current,
            value,
          );
        });

        setStep('hurdle');
      },
      [],
    );

  const chooseHurdle =
    useCallback(
      (
        value: NonNullable<
          DiscoveryState['hurdle']
        >,
      ) => {
        setState((current) => {
          if (!current) {
            return null;
          }

          return setHurdle(
            current,
            value,
          );
        });

        setStep('reveal');
      },
      [],
    );

  const choose =
    useCallback(
      (choice: DiscoveryChoice) => {
        setSelectedChoice(choice);
      },
      [],
    );

  if (!ready || !state) {
    return (
      <div className="min-h-[70vh]" />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8 sm:px-10 lg:px-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-[-0.03em]">
            urge
          </div>

          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Find your starting point
          </div>
        </header>

        {/* Progress */}
        <div className="mt-8 h-px bg-border">
          <div
            className="h-px bg-primary transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="mx-auto mt-20 max-w-5xl sm:mt-28">
          {step === 'situation' && (
            <DiscoverySituation
              options={
                DISCOVERY_SITUATIONS
              }
              value={state.situation}
              onSelect={
                chooseSituation
              }
            />
          )}

          {step === 'hurdle' && (
            <DiscoveryHurdle
              options={
                DISCOVERY_HURDLES
              }
              value={state.hurdle}
              onSelect={
                chooseHurdle
              }
            />
          )}

          {step === 'reveal' &&
            reveal && (
              <DiscoveryReveal
                reveal={reveal}
                onContinue={() =>
                  setStep('choice')
                }
              />
            )}

          {step === 'choice' && (
            <>
              <DiscoveryChoiceView
                onChoose={choose}
              />

              {selectedChoice && (
                <div className="mt-10 border border-primary/30 bg-primary/[0.04] p-5 text-sm">
                  <p className="font-medium">
                    {selectedChoice ===
                    'join'
                      ? 'Join Urge selected.'
                      : 'Try the first mission selected.'}
                  </p>

                  <p className="mt-1 text-muted-foreground">
                    Registration will be connected
                    here next.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}