import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserTask {
  id: string;
  userId: string;

  title: string;
  description: string | null;

  status: string;
  taskType: string | null;

  sourceNodeId: string | null;

  dueAt: string | null;
  completedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

export const $userTasksStore =
  atom<{
    items: UserTask[];
    hydrated: boolean;
  }>({
    items: [],
    hydrated: false,
  });

export function setUserTasks(
  items: UserTask[],
) {
  $userTasksStore.set({
    items,
    hydrated: true,
  });
}

export function addUserTask(
  task: UserTask,
) {
  const current =
    $userTasksStore.get();

  $userTasksStore.set({
    items: [
      ...current.items,
      task,
    ],
    hydrated: true,
  });
}

export function updateUserTask(
  id: string,
  updates: Partial<UserTask>,
) {
  const current =
    $userTasksStore.get();

  $userTasksStore.set({
    items: current.items.map((item) =>
      item.id === id
        ? { ...item, ...updates }
        : item,
    ),
    hydrated: true,
  });
}