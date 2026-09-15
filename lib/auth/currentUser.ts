import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type {
  CurrentUser,
} from './types';

import { createClient } from '@/utils/supabase/server';

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data: profile,
    error,
  } =
    await supabase
      .from('user_profile')
      .select('*')
      .eq(
        'user_id',
        user.id,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user profile: ${error.message}`,
    );
  }

  return {
    auth: user,
    profile,
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    redirect('/register');
  }

  return currentUser;
}