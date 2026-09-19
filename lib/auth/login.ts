import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(
  input: LoginInput,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error(
      'Login succeeded but no user was returned.',
    );
  }

  return {
    user: data.user,
    session: data.session,
  };
}