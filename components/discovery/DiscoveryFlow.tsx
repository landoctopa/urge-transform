
'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  barrierOptions,
  discoverySteps,
  motivationOptions,
  readinessOptions,
  situationOptions,
} from '@/lib/discovery/flow';

import type { DiscoveryState } from '@/lib/discovery/types';

import {
  loadDiscoveryState,
  saveDiscoveryState,
  setBarriers,
  setMotivations,
  setReadiness,
  setSituation,
} from '@/lib/discovery/state';

import { DiscoveryProgress } from './DiscoveryProgress';
import { DiscoveryOption } from './DiscoveryOption';

export function DiscoveryFlow() {
  const [state, setState] =
    useState<DiscoveryState | null>(null);

  /*
   * Load anonymous discovery state
   * once on the client.
   */
  useEffect(() => {
    setState(loadDiscoveryState());
  }, []);

  /*
   * Persist discovery state whenever
   * it changes.
   */
  useEffect(() => {
    if (!state) {
      return;
    }

    saveDiscoveryState(state);
  }, [state]);

  /*
   * We don't render the flow until the
   * client has restored local state.
   */
  if (!state) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Getting things ready...
      </div>
    );
  }

  /*
   * From this point onward state is
   * guaranteed to be non-null.
   *
   * Keep a local non-null reference so
   * nested handlers retain the same
   * TypeScript narrowing.
   */
  const discoveryState = state;

  const currentIndex = useMemo(() => {
    return discoverySteps.findIndex(
      (step) =>
        step.stage ===
        discoveryState.stage,
    );
  }, [
    discoveryState.stage,
  ]);

  const step =
    discoverySteps[currentIndex];

  if (!step) {
    return null;
  }

  function start() {
    setState({
      ...discoveryState,
      stage: 'situation',
      updatedAt:
        new Date().toISOString(),
    });
  }

  function selectSituation(
    value: DiscoveryState['situation'],
  ) {
    if (!value) {
      return;
    }

    setState(
      setSituation(
        discoveryState,
        value,
      ),
    );
  }

  function toggleMotivation(
    value: string,
  ) {
    const exists =
      discoveryState.motivations.includes(
        value,
      );

    const next = exists
      ? discoveryState.motivations.filter(
          (item) =>
            item !== value,
        )
      : [
          ...discoveryState.motivations,
          value,
        ];

    setState(
      setMotivations(
        discoveryState,
        next,
      ),
    );
  }

  function toggleBarrier(
    value: string,
  ) {
    const exists =
      discoveryState.barriers.includes(
        value,
      );

    const next = exists
      ? discoveryState.barriers.filter(
          (item) =>
            item !== value,
        )
      : [
          ...discoveryState.barriers,
          value,
        ];

    setState(
      setBarriers(
        discoveryState,
        next,
      ),
    );
  }

  function selectReadiness(
    value: number,
  ) {
    setState(
      setReadiness(
        discoveryState,
        value,
      ),
    );
  }

  return (
    <section className="space-y-10">
      <DiscoveryProgress
        current={Math.max(
          currentIndex,
          1,
        )}
        total={
          discoverySteps.length - 1
        }
      />

      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {step.eyebrow}
        </p>

        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {step.title}
        </h1>

        {step.description && (
          <p className="max-w-2xl text-muted-foreground">
            {step.description}
          </p>
        )}
      </div>

      {discoveryState.stage ===
        'situation' && (
        <div className="space-y-3">
          {situationOptions.map(
            (option) => (
              <DiscoveryOption
                key={option.value}
                label={option.label}
                description={
                  option.description
                }
                selected={
                  discoveryState.situation ===
                  option.value
                }
                onClick={() =>
                  selectSituation(
                    option.value,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      {discoveryState.stage ===
        'motivation' && (
        <div className="space-y-3">
          {motivationOptions.map(
            (option) => (
              <DiscoveryOption
                key={option.value}
                label={option.label}
                selected={discoveryState.motivations.includes(
                  option.value,
                )}
                multiple
                onClick={() =>
                  toggleMotivation(
                    option.value,
                  )
                }
              />
            ),
          )}

          <button
            type="button"
            disabled={
              discoveryState.motivations
                .length === 0
            }
            onClick={() =>
              setState(
                setMotivations(
                  discoveryState,
                  discoveryState.motivations,
                ),
              )
            }
            className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {discoveryState.stage ===
        'barrier' && (
        <div className="space-y-3">
          {barrierOptions.map(
            (option) => (
              <DiscoveryOption
                key={option.value}
                label={option.label}
                selected={discoveryState.barriers.includes(
                  option.value,
                )}
                multiple
                onClick={() =>
                  toggleBarrier(
                    option.value,
                  )
                }
              />
            ),
          )}

          <button
            type="button"
            disabled={
              discoveryState.barriers
                .length === 0
            }
            onClick={() =>
              setState(
                setBarriers(
                  discoveryState,
                  discoveryState.barriers,
                ),
              )
            }
            className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {discoveryState.stage ===
        'readiness' && (
        <div className="space-y-3">
          {readinessOptions.map(
            (option) => (
              <DiscoveryOption
                key={option.value}
                label={option.label}
                selected={
                  discoveryState.readiness ===
                  option.value
                }
                onClick={() =>
                  selectReadiness(
                    option.value,
                  )
                }
              />
            ),
          )}

          {discoveryState.readiness !==
            null && (
            <div className="pt-5">
              <button
                type="button"
                className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
                onClick={() => {
                  /*
                   * D2 will replace this with
                   * the Discovery Fit Reveal.
                   */
                  console.log(
                    'Discovery complete',
                    discoveryState,
                  );
                }}
              >
                See what this means
              </button>
            </div>
          )}
        </div>
      )}

      {discoveryState.stage ===
        'situation' && (
        <div className="pt-3 text-sm text-muted-foreground">
          Choose the option that feels
          closest to your current situation.
        </div>
      )}

      {discoveryState.stage ===
        'orientation' && (
        <div>
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Let&apos;s begin
          </button>
        </div>
      )}
    </section>
  );
}

