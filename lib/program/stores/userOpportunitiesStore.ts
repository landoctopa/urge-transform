import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserOpportunity {
  id: string;
  userId: string;

  title: string | null;
  description: string | null;

  status: string;
  source: string | null;
  sourceNodeId: string | null;

  problem: string | null;
  customer: string | null;
  hypothesis: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

export interface UserOpportunitiesState {
  items: UserOpportunity[];
  hydrated: boolean;
}

export const $userOpportunitiesStore =
  atom<UserOpportunitiesState>({
    items: [],
    hydrated: false,
  });

export function setUserOpportunities(
  items: UserOpportunity[],
) {
  $userOpportunitiesStore.set({
    items,
    hydrated: true,
  });
}

export function addUserOpportunity(
  opportunity: UserOpportunity,
) {
  const current =
    $userOpportunitiesStore.get();

  $userOpportunitiesStore.set({
    items: [
      ...current.items,
      opportunity,
    ],
    hydrated: true,
  });
}

export function updateUserOpportunity(
  id: string,
  updates: Partial<UserOpportunity>,
) {
  const current =
    $userOpportunitiesStore.get();

  $userOpportunitiesStore.set({
    ...current,

    items: current.items.map((item) =>
      item.id === id
        ? { ...item, ...updates }
        : item,
    ),
  });
}

export function clearUserOpportunities() {
  $userOpportunitiesStore.set({
    items: [],
    hydrated: false,
  });
}