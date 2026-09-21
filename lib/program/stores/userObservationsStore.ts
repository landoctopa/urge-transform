import { atom } from 'nanostores';

import type {
  Database,
} from '@/types/supabase';

type ObservationRow =
  Database['public']['Tables']['user_observations']['Row'];

export interface UserObservation {
  id: ObservationRow['id'];
  userId: ObservationRow['user_id'];
  domain: ObservationRow['domain'];
  focus: ObservationRow['focus'];
  type: ObservationRow['type'];
  title: ObservationRow['title'];
  content: ObservationRow['content'];
  sourceNodeKey: string | null;
  observedAt: ObservationRow['observed_at'];
  metadata: ObservationRow['metadata'];
  createdAt: ObservationRow['created_at'];
  updatedAt: ObservationRow['updated_at'];
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