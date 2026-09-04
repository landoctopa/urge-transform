import type {
  ContainerType,
  ProgramMission,
  ProgramNode,
} from './types';

import type { ProgramProgress } from './progress';

export interface ProgramDestination {
  type: 'mission' | 'quest' | 'complete';

  missionId: string;

  questId?: string;

  nodeKey?: string;
}

export function getContainerNodes(
  mission: ProgramMission,
  containerType: ContainerType,
  containerKey: string,
): ProgramNode[] {
  return mission.nodes
    .filter(
      (node) =>
        node.container.type === containerType &&
        node.container.key === containerKey,
    )
    .sort(
      (a, b) => a.sequence - b.sequence,
    );
}

/**
 * All nodes in the actual mission journey.
 *
 * This is different from getContainerNodes().
 * It deliberately includes both mission and
 * quest nodes.
 */
export function getJourneyNodes(
  mission: ProgramMission,
): ProgramNode[] {
  return [...mission.nodes].sort(
    (a, b) => a.sequence - b.sequence,
  );
}

export function getNode(
  mission: ProgramMission,
  nodeKey: string,
): ProgramNode | null {
  return (
    mission.nodes.find(
      (node) => node.key === nodeKey,
    ) ?? null
  );
}

export function getCurrentNode(
  mission: ProgramMission,
  containerType: ContainerType,
  containerKey: string,
  progress: ProgramProgress,
): ProgramNode | null {
  const nodes = getContainerNodes(
    mission,
    containerType,
    containerKey,
  );

  if (nodes.length === 0) {
    return null;
  }

  /*
   * If the progress points at a node inside
   * this container, resume there.
   */
  if (progress.currentNodeKey) {
    const current = nodes.find(
      (node) =>
        node.key === progress.currentNodeKey &&
        !isNodeCompleted(
          progress,
          node.key,
        ),
    );

    if (current) {
      return current;
    }
  }

  return (
    nodes.find(
      (node) =>
        !isNodeCompleted(
          progress,
          node.key,
        ) &&
        canEnterNode(
          node,
          progress,
        ),
    ) ?? null
  );
}

export function canEnterNode(
  node: ProgramNode,
  progress: ProgramProgress,
): boolean {
  const dependencies =
    node.dependencies ?? [];

  return dependencies.every((dependency) =>
    isNodeCompleted(progress, dependency),
  );
}

export function isNodeCompleted(
  progress: ProgramProgress,
  nodeKey: string,
): boolean {
  return progress.completedNodeKeys.includes(
    nodeKey,
  );
}

/**
 * Find the next node in the overall journey.
 *
 * This is the core transition mechanism.
 *
 * If the next node belongs to another quest,
 * the caller navigates to that quest.
 *
 * If it belongs to the mission, the caller
 * navigates back to the mission container.
 */
export function getNextNode(
  mission: ProgramMission,
  nodeKey: string,
  progress: ProgramProgress,
): ProgramNode | null {
  const journey =
    getJourneyNodes(mission);

  const index = journey.findIndex(
    (node) => node.key === nodeKey,
  );

  if (index === -1) {
    return null;
  }

  for (
    let i = index + 1;
    i < journey.length;
    i++
  ) {
    const candidate = journey[i];

    if (canEnterNode(candidate, progress)) {
      return candidate;
    }
  }

  return null;
}

export function getPreviousNode(
  mission: ProgramMission,
  nodeKey: string,
): ProgramNode | null {
  const journey =
    getJourneyNodes(mission);

  const index = journey.findIndex(
    (node) => node.key === nodeKey,
  );

  if (index <= 0) {
    return null;
  }

  return journey[index - 1] ?? null;
}

/**
 * Convert a node transition into a route destination.
 */
export function getDestinationForNode(
  mission: ProgramMission,
  node: ProgramNode | null,
): ProgramDestination {
  if (!node) {
    return {
      type: 'complete',
      missionId: mission.key,
    };
  }

  if (node.container.type === 'mission') {
    return {
      type: 'mission',
      missionId: mission.key,
      nodeKey: node.key,
    };
  }

  return {
    type: 'quest',
    missionId: mission.key,
    questId: node.container.key,
    nodeKey: node.key,
  };
}

export function getNextDestination(
  mission: ProgramMission,
  nodeKey: string,
  progress: ProgramProgress,
): ProgramDestination {
  const nextNode = getNextNode(
    mission,
    nodeKey,
    progress,
  );

  return getDestinationForNode(
    mission,
    nextNode,
  );
}