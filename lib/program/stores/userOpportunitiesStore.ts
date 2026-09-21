import { atom } from 'nanostores';

import type {
  Database,
} from '@/types/supabase';

type OpportunityRow =
  Database['public']['Tables']['user_opportunities']['Row'];

export interface UserOpportunity {
  id: OpportunityRow['id'];
  userId: OpportunityRow['user_id'];
  title: OpportunityRow['title'];
  description: OpportunityRow['description'];
  status: OpportunityRow['status'];
  source: OpportunityRow['source'];
  sourceNodeKey: string | null;
  problem: OpportunityRow['problem'];
  customer: OpportunityRow['customer'];
  hypothesis: OpportunityRow['hypothesis'];
  observationIds: OpportunityRow['observation_ids'];
  metadata: OpportunityRow['metadata'];
  createdAt: OpportunityRow['created_at'];
  updatedAt: OpportunityRow['updated_at'];
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
        ? {
            ...item,
            ...updates,
          }
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