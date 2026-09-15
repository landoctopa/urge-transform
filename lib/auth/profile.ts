import 'server-only';

import { cookies } from 'next/headers';

import type { Database } from '@/types/supabase';
import type { UserProfile } from './types';

import { createClient } from '@/utils/supabase/server';
import { requireCurrentUser } from './currentUser';

type UserProfileInsert =
  Database['public']['Tables']['user_profile']['Insert'];

type UserProfileUpdate =
  Database['public']['Tables']['user_profile']['Update'];

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const currentUser =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_profile')
    .select('*')
    .eq(
      'user_id',
      currentUser.auth.id,
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user profile: ${error.message}`,
    );
  }

  return data;
}

export async function createCurrentProfile(
  values: Omit<
    UserProfileInsert,
    'user_id'
  >,
): Promise<UserProfile> {
  const currentUser =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_profile')
    .insert({
      ...values,
      user_id: currentUser.auth.id,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user profile: ${error.message}`,
    );
  }

  return data;
}

export async function updateCurrentProfile(
  values: UserProfileUpdate,
): Promise<UserProfile> {
  const currentUser =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_profile')
    .update(values)
    .eq(
      'user_id',
      currentUser.auth.id,
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update user profile: ${error.message}`,
    );
  }

  return data;
}