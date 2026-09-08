'use client';

import {
  atom,
} from 'nanostores';

import type {
  HydrationDomain,
} from '@/lib/program/hydration/types';

import type {
  JourneyRuntimeState,
  ProgramJourney,
} from './types';

const initialState: JourneyRuntimeState = {
  journey: null,
  hydratedDomains: [],
  hydratingDomains: [],
  initialized: false,
};

export const $journeyStore =
  atom<JourneyRuntimeState>(
    initialState,
  );

export function setJourney(
  journey: ProgramJourney,
) {
  $journeyStore.set({
    ...$journeyStore.get(),
    journey,
  });
}

export function setJourneyInitialized(
  initialized: boolean,
) {
  $journeyStore.set({
    ...$journeyStore.get(),
    initialized,
  });
}

export function addHydratedDomains(
  domains: HydrationDomain[],
) {
  const current =
    $journeyStore.get();

  const merged =
    new Set([
      ...current.hydratedDomains,
      ...domains,
    ]);

  $journeyStore.set({
    ...current,
    hydratedDomains:
      Array.from(merged),
  });
}

export function setHydratingDomains(
  domains: HydrationDomain[],
) {
  $journeyStore.set({
    ...$journeyStore.get(),
    hydratingDomains: domains,
  });
}

export function clearJourneyRuntime() {
  $journeyStore.set(
    initialState,
  );
}