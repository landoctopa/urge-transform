'use server';

import {
  getProgramHydration,
} from '@/lib/program/hydration/server';

import type {
  HydrationDomain,
  ProgramHydrationState,
} from '@/lib/program/hydration/types';

interface HydrateProgramDomainsInput {
  missionKey: string;
  domains: HydrationDomain[];
}

interface HydrateProgramDomainsResult {
  success: boolean;
  data?: ProgramHydrationState;
  error?: string;
}

export async function hydrateProgramDomains(
  input: HydrateProgramDomainsInput,
): Promise<HydrateProgramDomainsResult> {
  try {
    if (
      input.domains.length ===
      0
    ) {
      return {
        success: true,
        data: {},
      };
    }

    const data =
      await getProgramHydration({
        missionKey:
          input.missionKey,

        domains:
          input.domains,
      });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      '[PROGRAM HYDRATION]',
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to hydrate program data',
    };
  }
}