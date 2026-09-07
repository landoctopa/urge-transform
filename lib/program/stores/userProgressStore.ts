import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export type UserNodeProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export interface UserNodeProgress {
  id: string | null;
  nodeKey: string;
  programContentId: string;

  status: UserNodeProgressStatus;

  startedAt: string | null;
  completedAt: string | null;

  payload: Json;

  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserProgressState {
  nodes: Record<string, UserNodeProgress>;

  hydrated: boolean;
  updatedAt: string | null;
}

const emptyState: UserProgressState = {
  nodes: {},
  hydrated: false,
  updatedAt: null,
};

export const $userProgressStore =
  atom<UserProgressState>(emptyState);

export function setUserProgress(
  progress: UserProgressState,
) {
  $userProgressStore.set(progress);
}

export function setNodeProgress(
  progress: UserNodeProgress,
) {
  const current =
    $userProgressStore.get();

  $userProgressStore.set({
    ...current,

    nodes: {
      ...current.nodes,
      [progress.nodeKey]: progress,
    },

    updatedAt:
      progress.updatedAt ??
      new Date().toISOString(),

    hydrated: true,
  });
}

export function updateNodeProgress(
  nodeKey: string,
  updates: Partial<UserNodeProgress>,
) {
  const current =
    $userProgressStore.get();

  const existing =
    current.nodes[nodeKey];

  if (!existing) {
    return;
  }

  setNodeProgress({
    ...existing,
    ...updates,
  });
}

export function getNodeProgress(
  nodeKey: string,
): UserNodeProgress | null {
  return (
    $userProgressStore.get()
      .nodes[nodeKey] ?? null
  );
}

export function clearUserProgress() {
  $userProgressStore.set(emptyState);
}