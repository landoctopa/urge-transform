'use client';

import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import type {
  HydrationDomain,
} from '@/lib/program/hydration/types';

import {
  hydrateProgramState,
} from '@/lib/program/hydration/client';

import {
  $journeyStore,
  addHydratedDomains,
  setHydratingDomains,
  setJourney,
} from './journeyStore';

import {
  getHydrationDomains,
} from './hydrationPolicy';

import {
  resolveJourney,
} from './journeyResolver';

interface EnsureJourneyHydrationOptions {
  mission: ProgramMission;
  node: ProgramNode;
  initialHydration?: Record<
    string,
    unknown
  >;
}

/**
 * Hydrate the data required by the current
 * journey boundary.
 *
 * This function deliberately does NOT fetch
 * from Supabase itself. Server-side fetching
 * happens in the page and the resulting state
 * is passed here.
 */
export function registerJourney(
  mission: ProgramMission,
  node: ProgramNode,
) {
  const journey =
    resolveJourney(
      mission.key,
      node,
    );

  setJourney(
    journey,
  );
}

/**
 * Given the hydration returned by the server,
 * populate Nano Stores and update the runtime
 * hydration registry.
 */
export function applyJourneyHydration(
  state: Parameters<
    typeof hydrateProgramState
  >[0],
  domains: HydrationDomain[],
) {
  hydrateProgramState(
    state,
  );

  addHydratedDomains(
    domains,
  );

  setHydratingDomains([]);
}

/**
 * Determine which domains still need to be
 * hydrated.
 */
export function getMissingHydrationDomains(
  domains: HydrationDomain[],
): HydrationDomain[] {
  const {
    hydratedDomains,
    hydratingDomains,
  } =
    $journeyStore.get();

  return domains.filter(
    (domain) =>
      !hydratedDomains.includes(
        domain,
      ) &&
      !hydratingDomains.includes(
        domain,
      ),
  );
}