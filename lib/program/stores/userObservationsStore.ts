import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserObservation {
  id: string;
  userId: string;

  type: string | null;
  title: string | null;

  content: Json;

  sourceNodeId: string | null;

  observedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

export const $userObservationsStore =
  atom<{
    items: UserObservation[];
    hydrated: boolean;
  }>({
    items: [],
    hydrated: false,
  });

export function setUserObservations(
  items: UserObservation[],
) {
  $userObservationsStore.set({
    items,
    hydrated: true,
  });
}

export function addUserObservation(
  observation: UserObservation,
) {
  const current =
    $userObservationsStore.get();

  $userObservationsStore.set({
    items: [
      ...current.items,
      observation,
    ],
    hydrated: true,
  });
}