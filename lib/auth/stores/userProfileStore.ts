import { atom } from 'nanostores';

import type { UserProfile } from '@/lib/auth/types';

export interface UserProfileState {
  profile: UserProfile | null;
  hydrated: boolean;
}

const initialState: UserProfileState = {
  profile: null,
  hydrated: false,
};

export const $userProfileStore =
  atom<UserProfileState>(initialState);

export function setUserProfile(
  profile: UserProfile | null,
) {
  $userProfileStore.set({
    profile,
    hydrated: true,
  });
}

export function clearUserProfile() {
  $userProfileStore.set(initialState);
}