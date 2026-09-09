'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  barrierOptions,
  discoverySteps,
  motivationOptions,
  readinessOptions,
  situationOptions,
} from '@/lib/discovery/flow';

import type {
  DiscoverySituation,
  DiscoveryStage,
  DiscoveryState,
} from '@/lib/discovery/types';

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
  const [
    state,
    setState,
  ] = useState<DiscoveryState | null>(
    null,
  );

  /*
   * Restore anonymous discovery state.
   */
  useEffect(() => {
    setState(
      loadDiscoveryState(),
    );
  }, []);

  /*
   * Persist discovery state.
   */
  useEffect(() => {
    if (!state) {
      return;
    }

    saveDiscoveryState(state);
  }, [state]);

  /*
   * Wait for client-side hydration.
   */
  if (!state) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Getting things ready...
      </div>
    );
  }

  const discoveryState =
    state;

  const currentIndex =
    discoverySteps.findIndex(
      (step) =>
        step.stage ===
        discoveryState.stage,
    );

  const step =
    discoverySteps[
      currentIndex
    ];

  if (!step) {
    return null;
  }

  /*
   * Centralised stage transition.
   */
  function moveTo(
    stage: DiscoveryStage,
  ) {
    setState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,

        stage,

        updatedAt:
          new Date().toISOString(),
      };
    });
  }

  /*
   * Start discovery.
   */
  function start() {
    moveTo('situation');
  }

  /*
   * Situation
   */
  function chooseSituation(
    value: DiscoverySituation,
  ) {
    setState((current) => {
      if (!current) {
        return current;
      }

      const updated =
        setSituation(
          current,
          value,
        );

      return {
        ...updated,

        stage: 'future',

        updatedAt:
          new Date().toISOString(),
      };
    });
  }

  /*
   * Motivation
   */
  function chooseMotivation(
    value: string,
  ) {
    setState((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.motivations.includes(
          value,
        );

      const next = exists
        ? current.motivations.filter(
            (item) =>
              item !== value,
          )
        : [
            ...current.motivations,
            value,
          ];

      return setMotivations(
        current,
        next,
      );
    });
  }

  function continueFromMotivation() {
    setState((current) => {
      if (
        !current ||
        current.motivations
          .length === 0
      ) {
        return current;
      }

      return {
        ...current,

        stage: 'tension',

        updatedAt:
          new Date().toISOString(),
      };
    });
  }

  /*
   * Barrier
   */
  function chooseBarrier(
    value: string,
  ) {
    setState((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.barriers.includes(
          value,
        );

      const next = exists
        ? current.barriers.filter(
            (item) =>
              item !== value,
          )
        : [
            ...current.barriers,
            value,
          ];

      return setBarriers(
        current,
        next,
      );
    });
  }

  function continueFromBarriers() {
    setState((current) => {
      if (
        !current ||
        current.barriers
          .length === 0
      ) {
        return current;
      }

      return {
        ...current,

        stage: 'urge',

        updatedAt:
          new Date().toISOString(),
      };
    });
  }

  /*
   * Readiness
   */
  function chooseReadiness(
    value: number,
  ) {
    setState((current) => {
      if (!current) {
        return current;
      }

      const updated =
        setReadiness(
          current,
          value,
        );

      return {
        ...updated,

        stage: 'commitment',

        updatedAt:
          new Date().toISOString(),
      };
    });
  }

  /*
   * Progress excludes orientation.
   */
  const progressCurrent =
    Math.max(
      currentIndex,
      1,
    );

  const progressTotal =
    discoverySteps.length - 1;

  return (
    <section className="space-y-10">
      <DiscoveryProgress
        current={
          progressCurrent
        }
        total={
          progressTotal
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

      {/*
       * ORIENTATION
       */}
      {discoveryState.stage ===
        'orientation' && (
        <div className="space-y-5">
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Let&apos;s begin
          </button>
        </div>
      )}

      {/*
       * SITUATION
       */}
      {discoveryState.stage ===
        'situation' && (
        <div className="space-y-3">
          {situationOptions.map(
            (option) => (
              <DiscoveryOption
                key={
                  option.value
                }
                label={
                  option.label
                }
                description={
                  option.description
                }
                selected={
                  discoveryState.situation ===
                  option.value
                }
                onClick={() =>
                  chooseSituation(
                    option.value,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      {/*
       * FUTURE
       *
       * This is deliberately an
       * aspiration / possibility beat,
       * not another questionnaire.
       */}
      {discoveryState.stage ===
        'future' && (
        <div className="space-y-6">
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Maybe it is a different
              kind of role.
            </p>

            <p>
              Maybe it is finally
              building something you
              have been thinking about.
            </p>

            <p>
              Maybe it is simply waking
              up and knowing that you
              are moving again.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              moveTo(
                'motivation',
              )
            }
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Keep going
          </button>
        </div>
      )}

      {/*
       * MOTIVATION
       */}
      {discoveryState.stage ===
        'motivation' && (
        <div className="space-y-3">
          {motivationOptions.map(
            (option) => (
              <DiscoveryOption
                key={
                  option.value
                }
                label={
                  option.label
                }
                selected={discoveryState.motivations.includes(
                  option.value,
                )}
                multiple
                onClick={() =>
                  chooseMotivation(
                    option.value,
                  )
                }
              />
            ),
          )}

          <button
            type="button"
            disabled={
              discoveryState
                .motivations
                .length === 0
            }
            onClick={
              continueFromMotivation
            }
            className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/*
       * TENSION
       */}
      {discoveryState.stage ===
        'tension' && (
        <div className="space-y-6">
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
            <p>
              Knowing you want something
              different is not the same
              as knowing what to do next.
            </p>

            <p className="text-muted-foreground">
              And that gap is where a lot
              of good intentions quietly
              disappear.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              moveTo(
                'barrier',
              )
            }
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Let&apos;s look at what gets
            in the way
          </button>
        </div>
      )}

      {/*
       * BARRIER
       */}
      {discoveryState.stage ===
        'barrier' && (
        <div className="space-y-3">
          {barrierOptions.map(
            (option) => (
              <DiscoveryOption
                key={
                  option.value
                }
                label={
                  option.label
                }
                selected={discoveryState.barriers.includes(
                  option.value,
                )}
                multiple
                onClick={() =>
                  chooseBarrier(
                    option.value,
                  )
                }
              />
            ),
          )}

          <button
            type="button"
            disabled={
              discoveryState
                .barriers
                .length === 0
            }
            onClick={
              continueFromBarriers
            }
            className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/*
       * URGE
       */}
      {discoveryState.stage ===
        'urge' && (
        <div className="max-w-2xl space-y-6">
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              This is what Urge is built
              for.
            </p>

            <p className="text-muted-foreground">
              Not another course you
              watch alone. Not a library
              of things you are supposed
              to figure out yourself.
            </p>

            <p className="text-muted-foreground">
              You get a path to follow,
              people moving alongside you,
              live sessions, a community,
              and access to experts and
              practical help when you need
              it.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              moveTo(
                'readiness',
              )
            }
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            I want to see where this goes
          </button>
        </div>
      )}

      {/*
       * READINESS
       */}
      {discoveryState.stage ===
        'readiness' && (
        <div className="space-y-3">
          {readinessOptions.map(
            (option) => (
              <DiscoveryOption
                key={
                  option.value
                }
                label={
                  option.label
                }
                selected={
                  discoveryState.readiness ===
                  option.value
                }
                onClick={() =>
                  chooseReadiness(
                    option.value,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      {/*
       * COMMITMENT
       */}
      {discoveryState.stage ===
        'commitment' && (
        <div className="max-w-2xl space-y-6">
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              You do not need to know
              exactly where this leads.
            </p>

            <p className="text-muted-foreground">
              You only need to decide
              whether it is worth giving
              yourself a real chance to find
              out.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              /*
               * Next step:
               * discovery fit / promise /
               * membership conversion.
               */
              console.log(
                'Discovery complete',
                discoveryState,
              );
            }}
            className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Show me my path
          </button>
        </div>
      )}
    </section>
  );
}