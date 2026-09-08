import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import type {
  HydrationDomain,
} from '@/lib/program/hydration/types';

const DOMAIN_MAP: Record<
  string,
  HydrationDomain
> = {
  'user.profile':
    'profile',

  'user.opportunities':
    'opportunities',

  'user.projects':
    'projects',

  'user.contacts':
    'contacts',

  'user.commitments':
    'commitments',

  'user.tasks':
    'tasks',

  'user.observations':
    'observations',

  'mission.progress':
    'progress',
};

export function getHydrationDomains(
  mission: ProgramMission,
  node?: ProgramNode,
): HydrationDomain[] {
  const contextKeys = [
    ...(mission.context ?? []),
    ...(node?.context ?? []),
  ];

  const domains =
    new Set<HydrationDomain>();

  for (const key of contextKeys) {
    const domain =
      DOMAIN_MAP[key];

    if (domain) {
      domains.add(domain);
    }
  }

  /*
   * Progress is fundamental to journey execution.
   *
   * Even if a future mission forgets to explicitly
   * declare it, the runtime should have progress
   * available.
   */
  domains.add('progress');

  return Array.from(domains);
}