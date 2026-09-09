'use client';

import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import type {
  HydrationDomain,
} from '@/lib/program/hydration/types';

import type {
  ProgramHydrationState,
} from '@/lib/program/hydration/types';

import {
  hydrateProgramState,
} from '@/lib/program/hydration/client';

import {
  hydrateProgramDomains,
} from '@/app/actions/programHydration';

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

export function applyJourneyHydration(
  state: ProgramHydrationState,
  domains: HydrationDomain[],
) {
  if (
    domains.length ===
    0
  ) {
    return;
  }

  hydrateProgramState(
    state,
  );

  addHydratedDomains(
    domains,
  );

  setHydratingDomains(
    [],
  );
}

export async function ensureJourneyHydration(
  mission: ProgramMission,
  node?: ProgramNode,
  initialHydration?: ProgramHydrationState,
): Promise<void> {
  const requiredDomains =
    getHydrationDomains(
      mission,
      node,
    );

  const missingDomains =
    getMissingHydrationDomains(
      requiredDomains,
    );

  /*
   * Everything this journey needs
   * is already available locally.
   */
  if (
    missingDomains.length ===
    0
  ) {
    return;
  }

  /*
   * If the server already supplied
   * hydration for this journey,
   * consume that first.
   */
  if (initialHydration) {
    const suppliedDomains =
      requiredDomains.filter(
        (domain) =>
          initialHydration[
            domain
          ] !== undefined,
      );

    const usableDomains =
      suppliedDomains.filter(
        (domain) =>
          missingDomains.includes(
            domain,
          ),
      );

    if (
      usableDomains.length > 0
    ) {
      applyJourneyHydration(
        initialHydration,
        usableDomains,
      );
    }
  }

  /*
   * Recalculate after applying any
   * server-provided hydration.
   */
  const stillMissing =
    getMissingHydrationDomains(
      requiredDomains,
    );

  if (
    stillMissing.length ===
    0
  ) {
    return;
  }

  /*
   * Mark these domains as being
   * hydrated before making the request.
   *
   * This prevents duplicate requests
   * if the component renders again.
   */
  setHydratingDomains(
    stillMissing,
  );

  try {
    const result =
      await hydrateProgramDomains({
        missionKey:
          mission.key,

        domains:
          stillMissing,
      });

    if (
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.error ??
          'Program hydration failed',
      );
    }

    applyJourneyHydration(
      result.data,
      stillMissing,
    );
  } catch (error) {
    /*
     * Clear the in-flight marker so
     * a subsequent attempt can retry.
     */
    setHydratingDomains(
      [],
    );

    throw error;
  }
}