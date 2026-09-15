import 'server-only';

import { cookies } from 'next/headers';

import type { Database } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

type UserProfileInsert =
  Database['public']['Tables']['user_profile']['Insert'];

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
  ageGroup?: string | null;
  gender?: string | null;
  city?: string | null;
  country?: string | null;
}

export async function registerUser(input: RegisterInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      'Registration succeeded but no user was returned.',
    );
  }

  const profile: UserProfileInsert = {
    user_id: authData.user.id,
    username: input.username,
    age_group: input.ageGroup ?? null,
    gender: input.gender ?? null,
    city: input.city ?? null,
    country: input.country ?? null,
  };

  const {
    error: profileError,
  } = await supabase
    .from('user_profile')
    .insert(profile);

  if (profileError) {
    throw new Error(
      `Account created but profile creation failed: ${profileError.message}`,
    );
  }

  return {
    user: authData.user,
    session: authData.session,
  };
}