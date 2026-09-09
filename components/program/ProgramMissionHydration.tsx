'use client';

import {
  useEffect,
  useRef,
} from 'react';

import type {
  ProgramMission,
} from '@/lib/program/types';

import type {
  HydrationDomain,
  ProgramHydrationState,
} from '@/lib/program/hydration/types';

import {
  registerJourney,
  applyJourneyHydration,
} from '@/lib/program/journey';

interface ProgramMissionHydrationProps {
  mission: ProgramMission;

  initialHydration:
    ProgramHydrationState;

  hydrationDomains:
    HydrationDomain[];

  children:
    React.ReactNode;
}

export function ProgramMissionHydration({
  mission,
  initialHydration,
  hydrationDomains,
  children,
}: ProgramMissionHydrationProps) {
  const hydratedRef =
    useRef(false);

  useEffect(() => {
    /*
     * The mission layout persists while
     * navigating between mission and quest
     * routes.
     *
     * Therefore we only apply the server
     * hydration payload once for this
     * mounted mission boundary.
     */
    if (hydratedRef.current) {
      return;
    }

    hydratedRef.current = true;

    /*
     * Register the journey boundary.
     *
     * There is no node available at the
     * layout level, so journey registration
     * happens in the shell once the node
     * is known.
     */
    applyJourneyHydration(
      initialHydration,
      hydrationDomains,
    );
  }, [
    initialHydration,
    hydrationDomains,
  ]);

  return (
    <>
      {children}
    </>
  );
}