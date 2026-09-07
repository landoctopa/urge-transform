import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserCommitment {
  id: string;
  userId: string;

  commitment: string;
  reason: string | null;

  status: string;

  sourceNodeId: string | null;

  startsAt: string | null;
  dueAt: string | null;
  completedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

export const $userCommitmentsStore =
  atom<{
    items: UserCommitment[];
    hydrated: boolean;
  }>({
    items: [],
    hydrated: false,
  });

export function setUserCommitments(
  items: UserCommitment[],
) {
  $userCommitmentsStore.set({
    items,
    hydrated: true,
  });
}

export function addUserCommitment(
  commitment: UserCommitment,
) {
  const current =
    $userCommitmentsStore.get();

  $userCommitmentsStore.set({
    items: [
      ...current.items,
      commitment,
    ],
    hydrated: true,
  });
}

export function updateUserCommitment(
  id: string,
  updates: Partial<UserCommitment>,
) {
  const current =
    $userCommitmentsStore.get();

  $userCommitmentsStore.set({
    items: current.items.map((item) =>
      item.id === id
        ? { ...item, ...updates }
        : item,
    ),
    hydrated: true,
  });
}