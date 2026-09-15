import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Database } from '@/types/supabase';
import type { CurrentUser, UserProfile} from './types';

import { createClient } from '@/utils/supabase/server';

type UserProfileRow =
  Database['public']['Tables']['user_profile']['Row'];

function rowToUserProfile(
  row: UserProfileRow,
): UserProfile {
  return {
    id: row.id,
    user_id: row.user_id,

    username: row.username,
    age_group: row.age_group,
    gender: row.gender,
    city: row.city,
    country: row.country,

    motivations: row.motivations,
    fears: row.fears,
    perceived_barriers: row.perceived_barriers,
    desired_future: row.desired_future,
    quit_conditions: row.quit_conditions,

    capabilities: row.capabilities,
    experience: row.experience,
    resources: row.resources,
    network_context: row.network_context,
    constraints: row.constraints,

    metadata: row.metadata,

    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}


export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data: profile,
    error,
  } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user profile: ${error.message}`,
    );
  }

  return {
    auth: user,
    profile: profile
      ? rowToUserProfile(profile)
      : null,
  };
}


export async function requireCurrentUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/register');
  }

  return currentUser;
}