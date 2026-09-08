import type {
  HydrationDomain,
} from '@/lib/program/hydration/types';

export interface ProgramJourney {
  missionKey: string;
  questKey: string | null;
  nodeKey: string;
}

export interface JourneyRuntimeState {
  journey: ProgramJourney | null;

  /**
   * Domains currently available in Nano Stores.
   *
   * This is runtime/cache state, not durable user progress.
   */
  hydratedDomains: HydrationDomain[];

  /**
   * Prevents duplicate hydration requests while
   * a previous request is still in flight.
   */
  hydratingDomains: HydrationDomain[];

  initialized: boolean;
}