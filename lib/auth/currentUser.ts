import 'server-only';

import { cookies } from 'next/headers';

import type {
  User,
} from '@supabase/supabase-js';

import {
  createClient,
} from '@/utils/supabase/server';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore =
    await cookies();

  const supabase =
    createClient(
      cookieStore,
    );

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    console.error(
      '[AUTH] Failed to get current user:',
      error,
    );

    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      'Authentication required',
    );
  }

  return user;
}