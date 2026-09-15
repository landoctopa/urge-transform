import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

function getSafeNext(value: string | null) {
  const fallback = '/profile/complete?intent=trial';

  if (!value) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);

    const url = new URL(
      decoded,
      'http://local.internal',
    );

    if (url.origin !== 'http://local.internal') {
      return fallback;
    }

    if (url.pathname !== '/profile/complete') {
      return fallback;
    }

    const intent = url.searchParams.get('intent');

    if (
      intent !== 'join' &&
      intent !== 'trial'
    ) {
      return fallback;
    }

    return `/profile/complete?intent=${intent}`;
  } catch {
    return fallback;
  }
}

export async function GET(
  request: NextRequest,
) {
  const code =
    request.nextUrl.searchParams.get('code');

  const next = getSafeNext(
    request.nextUrl.searchParams.get('next'),
  );

  if (!code) {
    console.error(
      'Email confirmation callback did not receive an auth code.',
    );

    return NextResponse.redirect(
      new URL(
        '/register?error=confirmation_invalid',
        request.url,
      ),
    );
  }

  const cookieStore = await cookies();

  const supabase =
    createClient(cookieStore);

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code,
    );

  if (error) {
    console.error(
      'Email confirmation code exchange failed:',
      error,
    );

    return NextResponse.redirect(
      new URL(
        '/register?error=confirmation_failed',
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(next, request.url),
  );
}