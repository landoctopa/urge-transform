import type {
  ProgramMission,
  ProgramNode,
} from './types';

export interface ContainerProgress {
  currentNodeKey?: string;
  completedNodeKeys?: string[];
}

export function getContainerNodes(
  mission: ProgramMission,
  containerType: 'mission' | 'quest',
  containerKey: string,
): ProgramNode[] {
  return mission.nodes
    .filter(
      (node) =>
        node.container.type === containerType &&
        node.container.key === containerKey,
    )
    .sort((a, b) => a.sequence - b.sequence);
}

export function getCurrentNode(
  mission: ProgramMission,
  containerType: 'mission' | 'quest',
  containerKey: string,
  progress: ContainerProgress = {},
): ProgramNode | null {
  const nodes = getContainerNodes(
    mission,
    containerType,
    containerKey,
  );

  if (nodes.length === 0) {
    return null;
  }

  if (progress.currentNodeKey) {
    const currentNode = nodes.find(
      (node) => node.key === progress.currentNodeKey,
    );

    if (currentNode) {
      return currentNode;
    }
  }

  const completed = new Set(
    progress.completedNodeKeys ?? [],
  );

  return (
    nodes.find(
      (node) => !completed.has(node.key),
    ) ?? null
  );
}

export function getNextNode(
  mission: ProgramMission,
  containerType: 'mission' | 'quest',
  containerKey: string,
  nodeKey: string,
): ProgramNode | null {
  const nodes = getContainerNodes(
    mission,
    containerType,
    containerKey,
  );

  const index = nodes.findIndex(
    (node) => node.key === nodeKey,
  );

  if (index === -1) {
    return null;
  }

  return nodes[index + 1] ?? null;
}

export function getPreviousNode(
  mission: ProgramMission,
  containerType: 'mission' | 'quest',
  containerKey: string,
  nodeKey: string,
): ProgramNode | null {
  const nodes = getContainerNodes(
    mission,
    containerType,
    containerKey,
  );

  const index = nodes.findIndex(
    (node) => node.key === nodeKey,
  );

  if (index <= 0) {
    return null;
  }

  return nodes[index - 1] ?? null;
}