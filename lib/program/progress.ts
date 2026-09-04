import type { ProgramNode } from './types';

export type ProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed';

export interface NodeProgress {
  nodeKey: string;

  status: ProgressStatus;

  startedAt?: string;

  completedAt?: string;

  payload: Record<string, unknown>;

  aiData?: Record<string, unknown>;
}

export interface ProgramProgress {
  missionKey: string;

  status: ProgressStatus;

  currentNodeKey?: string;

  completedNodeKeys: string[];

  nodes: Record<string, NodeProgress>;

  payload: Record<string, unknown>;

  aiData: Record<string, unknown>;

  updatedAt?: string;
}

export function createInitialProgress(
  missionKey: string,
): ProgramProgress {
  return {
    missionKey,
    status: 'in_progress',
    currentNodeKey: undefined,
    completedNodeKeys: [],
    nodes: {},
    payload: {},
    aiData: {},
    updatedAt: new Date().toISOString(),
  };
}

export function isNodeCompleted(
  progress: ProgramProgress,
  nodeKey: string,
): boolean {
  return progress.completedNodeKeys.includes(
    nodeKey,
  );
}

export function getNodeProgress(
  progress: ProgramProgress,
  node: ProgramNode,
): NodeProgress {
  return (
    progress.nodes[node.key] ?? {
      nodeKey: node.key,
      status: 'not_started',
      payload: {},
    }
  );
}