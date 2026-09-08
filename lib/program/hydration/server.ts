import 'server-only';

import {
  getUserProfile,
} from '@/lib/program/data/userProfile';

import {
  getUserProgress,
} from '@/lib/program/data/userProgress';

import {
  getUserOpportunities,
} from '@/lib/program/data/userOpportunities';

import {
  getUserProjects,
} from '@/lib/program/data/userProjects';

import {
  getUserContacts,
} from '@/lib/program/data/userContacts';

import {
  getUserCommitments,
} from '@/lib/program/data/userCommitments';

import {
  getUserTasks,
} from '@/lib/program/data/userTasks';

import {
  getUserObservations,
} from '@/lib/program/data/userObservations';

import type {
  ProgramHydrationRequest,
  ProgramHydrationState,
  HydrationDomain,
} from './types';

export async function getProgramHydration(
  request: ProgramHydrationRequest,
): Promise<ProgramHydrationState> {
  const domains = new Set(
    request.domains,
  );

  const result: ProgramHydrationState = {};

  const loaders: Partial<
    Record<
      HydrationDomain,
      () => Promise<unknown>
    >
  > = {
    profile: () =>
      getUserProfile(),

    progress: () =>
      getUserProgress(
        request.missionKey,
      ),

    opportunities: () =>
      getUserOpportunities(),

    projects: () =>
      getUserProjects(),

    contacts: () =>
      getUserContacts(),

    commitments: () =>
      getUserCommitments(),

    tasks: () =>
      getUserTasks(),

    observations: () =>
      getUserObservations(),
  };

  const requestedDomains =
    Array.from(domains);

  const entries =
    await Promise.all(
      requestedDomains.map(
        async (domain) => {
          const loader =
            loaders[domain];

          if (!loader) {
            throw new Error(
              `Unsupported hydration domain: ${domain}`,
            );
          }

          return [
            domain,
            await loader(),
          ] as const;
        },
      ),
    );

  for (const [
    domain,
    value,
  ] of entries) {
    switch (domain) {
      case 'profile':
        result.profile =
          value as ProgramHydrationState['profile'];
        break;

      case 'progress':
        result.progress =
          value as ProgramHydrationState['progress'];
        break;

      case 'opportunities':
        result.opportunities =
          value as ProgramHydrationState['opportunities'];
        break;

      case 'projects':
        result.projects =
          value as ProgramHydrationState['projects'];
        break;

      case 'contacts':
        result.contacts =
          value as ProgramHydrationState['contacts'];
        break;

      case 'commitments':
        result.commitments =
          value as ProgramHydrationState['commitments'];
        break;

      case 'tasks':
        result.tasks =
          value as ProgramHydrationState['tasks'];
        break;

      case 'observations':
        result.observations =
          value as ProgramHydrationState['observations'];
        break;
    }
  }

  return result;
}