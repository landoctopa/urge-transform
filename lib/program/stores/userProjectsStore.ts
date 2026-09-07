import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserProject {
  id: string;
  userId: string;

  opportunityId: string | null;

  name: string;
  description: string | null;

  status: string;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

export interface UserProjectsState {
  items: UserProject[];
  hydrated: boolean;
}

export const $userProjectsStore =
  atom<UserProjectsState>({
    items: [],
    hydrated: false,
  });

export function setUserProjects(
  items: UserProject[],
) {
  $userProjectsStore.set({
    items,
    hydrated: true,
  });
}

export function addUserProject(
  project: UserProject,
) {
  const current =
    $userProjectsStore.get();

  $userProjectsStore.set({
    items: [
      ...current.items,
      project,
    ],
    hydrated: true,
  });
}

export function updateUserProject(
  id: string,
  updates: Partial<UserProject>,
) {
  const current =
    $userProjectsStore.get();

  $userProjectsStore.set({
    ...current,

    items: current.items.map((item) =>
      item.id === id
        ? { ...item, ...updates }
        : item,
    ),
  });
}

export function clearUserProjects() {
  $userProjectsStore.set({
    items: [],
    hydrated: false,
  });
}