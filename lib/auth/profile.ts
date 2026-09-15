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
  const currentUser = await requireCurrentUser();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', currentUser.auth.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user profile: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,

    username: data.username,
    age_group: data.age_group,
    gender: data.gender,
    city: data.city,
    country: data.country,

    motivations: data.motivations,
    fears: data.fears,
    perceived_barriers: data.perceived_barriers,
    desired_future: data.desired_future,
    quit_conditions: data.quit_conditions,

    capabilities: data.capabilities,
    experience: data.experience,
    resources: data.resources,
    network_context: data.network_context,
    constraints: data.constraints,

    metadata: data.metadata,

    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}


export async function createCurrentProfile(
  values: Omit<UserProfileInsert, 'user_id'>,
): Promise<UserProfile> {
  const currentUser = await requireCurrentUser();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
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

  return {
    id: data.id,
    user_id: data.user_id,

    username: data.username,
    age_group: data.age_group,
    gender: data.gender,
    city: data.city,
    country: data.country,

    motivations: data.motivations,
    fears: data.fears,
    perceived_barriers: data.perceived_barriers,
    desired_future: data.desired_future,
    quit_conditions: data.quit_conditions,

    capabilities: data.capabilities,
    experience: data.experience,
    resources: data.resources,
    network_context: data.network_context,
    constraints: data.constraints,

    metadata: data.metadata,

    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}


export async function updateCurrentProfile(
  values: UserProfileUpdate,
): Promise<UserProfile> {
  const currentUser = await requireCurrentUser();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('user_profile')
    .update(values)
    .eq('user_id', currentUser.auth.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update user profile: ${error.message}`,
    );
  }

  return {
    id: data.id,
    user_id: data.user_id,

    username: data.username,
    age_group: data.age_group,
    gender: data.gender,
    city: data.city,
    country: data.country,

    motivations: data.motivations,
    fears: data.fears,
    perceived_barriers: data.perceived_barriers,
    desired_future: data.desired_future,
    quit_conditions: data.quit_conditions,

    capabilities: data.capabilities,
    experience: data.experience,
    resources: data.resources,
    network_context: data.network_context,
    constraints: data.constraints,

    metadata: data.metadata,

    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}