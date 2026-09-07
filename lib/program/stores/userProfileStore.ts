import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserProfileState {
  id: string | null;
  userId: string | null;

  motivations: Json;
  fears: Json;
  perceivedBarriers: Json;
  desiredFuture: Json;
  quitConditions: Json;

  capabilities: Json;
  experience: Json;
  resources: Json;
  networkContext: Json;
  constraints: Json;

  metadata: Json;

  createdAt: string | null;
  updatedAt: string | null;

  hydrated: boolean;
}

const emptyProfile: UserProfileState = {
  id: null,
  userId: null,

  motivations: [],
  fears: [],
  perceivedBarriers: [],
  desiredFuture: {},
  quitConditions: [],

  capabilities: [],
  experience: [],
  resources: [],
  networkContext: {},
  constraints: [],

  metadata: {},

  createdAt: null,
  updatedAt: null,

  hydrated: false,
};

export const $userProfileStore =
  atom<UserProfileState>(emptyProfile);

export function setUserProfile(
  profile: UserProfileState,
) {
  $userProfileStore.set(profile);
}

export function updateUserProfile(
  updates: Partial<UserProfileState>,
) {
  $userProfileStore.set({
    ...$userProfileStore.get(),
    ...updates,
  });
}

export function clearUserProfile() {
  $userProfileStore.set(emptyProfile);
}