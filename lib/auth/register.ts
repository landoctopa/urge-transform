import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export type RegistrationIntent = 'join' | 'trial';

export interface RegisterInput {
  email: string;
  password: string;
  intent: RegistrationIntent;
}

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000';

  return siteUrl.replace(/\/$/, '');
}

export async function registerUser(input: RegisterInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  /*
   * The intent is deliberately transient.
   *
   * It is encoded into the confirmation flow so that the user
   * returns to the same branch they selected in Discovery.
   */
  const nextPath =
    `/profile/complete?intent=${input.intent}`;

  const emailRedirectTo =
    `${getSiteUrl()}/auth/confirm?next=${encodeURIComponent(
      nextPath,
    )}`;

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo,
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      'Registration succeeded but no user was returned.',
    );
  }

  return {
    user: authData.user,
    session: authData.session,
  };
}