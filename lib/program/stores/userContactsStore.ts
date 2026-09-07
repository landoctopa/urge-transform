import { atom } from 'nanostores';

import type { Json } from '@/types/supabase';

export interface UserContact {
  id: string;
  userId: string;

  name: string;
  role: string | null;
  organization: string | null;
  relationship: string | null;
  context: string | null;

  contactDetails: Json;

  sourceNodeId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UserContactsState {
  items: UserContact[];
  hydrated: boolean;
}

export const $userContactsStore =
  atom<UserContactsState>({
    items: [],
    hydrated: false,
  });

export function setUserContacts(
  items: UserContact[],
) {
  $userContactsStore.set({
    items,
    hydrated: true,
  });
}

export function addUserContact(
  contact: UserContact,
) {
  const current =
    $userContactsStore.get();

  $userContactsStore.set({
    items: [
      ...current.items,
      contact,
    ],
    hydrated: true,
  });
}

export function updateUserContact(
  id: string,
  updates: Partial<UserContact>,
) {
  const current =
    $userContactsStore.get();

  $userContactsStore.set({
    items: current.items.map((item) =>
      item.id === id
        ? { ...item, ...updates }
        : item,
    ),
    hydrated: true,
  });
}

export function clearUserContacts() {
  $userContactsStore.set({
    items: [],
    hydrated: false,
  });
}