import {
  $userProfileStore,
  $userProgressStore,
  $userOpportunitiesStore,
  $userProjectsStore,
  $userContactsStore,
  $userCommitmentsStore,
  $userTasksStore,
  $userObservationsStore,
} from '@/lib/program/stores';

import type { ProgramNode } from '@/lib/program/types';

import type {
  ProgramNodeContext,
} from './types';

function getContextValue(
  key: string,
  node: ProgramNode,
): unknown {
  const [domain, field] =
    key.split('.');

  if (domain !== 'user') {
    return undefined;
  }

  switch (field) {
    case 'profile':
      return $userProfileStore.get();

    case 'progress':
      return $userProgressStore.get();

    case 'opportunities':
      return $userOpportunitiesStore.get();

    case 'projects':
      return $userProjectsStore.get();

    case 'contacts':
      return $userContactsStore.get();

    case 'commitments':
      return $userCommitmentsStore.get();

    case 'tasks':
      return $userTasksStore.get();

    case 'observations':
      return $userObservationsStore.get();

    default:
      console.warn(
        `[PROGRAM CONTEXT] Unknown context key "${key}" for node "${node.key}"`,
      );

      return undefined;
  }
}

export function buildNodeContext(
  node: ProgramNode,
): ProgramNodeContext {
  const context: ProgramNodeContext = {
    program: {
      nodeKey: node.key,
    },
  };

  for (const key of node.context ?? []) {
    const value =
      getContextValue(key, node);

    if (value === undefined) {
      continue;
    }

    const [, field] =
      key.split('.');

    if (!field) {
      continue;
    }

    context.user ??= {};

    (
      context.user as Record<
        string,
        unknown
      >
    )[field] = value;
  }

  return context;
}