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
      node.container.type === 'quest'
        ? node.container.key
        : null,

    nodeKey:
      node.key,
  };
}
/**
 * Quest nodes currently only carry their quest
 * container key. The mission is supplied by the
 * page/shell and therefore should be preferred
 * when available.
 *
 * This fallback exists only so the resolver can
 * remain useful independently.
 */
function extractMissionKey(
  node: ProgramNode,
): string {
  const match =
    node.key.match(
      /^(mission-\d+)/,
    );

  if (!match) {
    throw new Error(
      `Unable to resolve mission for node "${node.key}"`,
    );
  }

  return match[1];
}