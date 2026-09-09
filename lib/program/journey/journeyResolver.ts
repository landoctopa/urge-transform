import type {
  ProgramNode,
} from '@/lib/program/types';

import type {
  ProgramJourney,
} from './types';

export function resolveJourney(
  missionKey: string,
  node: ProgramNode,
): ProgramJourney {
  return {
    missionKey,

    questKey:
      node.container.type ===
      'quest'
        ? node.container.key
        : null,

    nodeKey:
      node.key,
  };
}