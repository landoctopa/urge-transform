import type { EmailOtpType } from '@supabase/supabase-js';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

function getSafeNext(
  value: string | null,
) {
  if (!value) {
    return '/profile/complete?intent=trial';
  }

  try {
    const decoded = decodeURIComponent(value);

    const url = new URL(
      decoded,
      'http://local.internal',
    );

    if (
      url.origin !==
      'http://local.internal'
    ) {
      return '/profile/complete?intent=trial';
    }

    if (
      url.pathname !==
      '/profile/complete'
    ) {
      return '/profile/complete?intent=trial';
    }

    const intent =
      url.searchParams.get('intent');

    if (
      intent !== 'join' &&
      intent !== 'trial'
    ) {
      return '/profile/complete?intent=trial';
    }

    return `/profile/complete?intent=${intent}`;
  } catch {
    return '/profile/complete?intent=trial';
  }
}

export async function GET(
  request: NextRequest,
) {
  const tokenHash =
    request.nextUrl.searchParams.get(
      'token_hash',
    );

  const type =
    request.nextUrl.searchParams.get(
      'type',
    ) as EmailOtpType | null;

  const next = getSafeNext(
    request.nextUrl.searchParams.get(
      'next',
    ),
  );

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL(
        '/login?error=confirmation_invalid',
        request.url,
      ),
    );
  }

  const cookieStore = await cookies();
  const supabase =
    createClient(cookieStore);

  const { error } =
    await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

  if (error) {
    console.error(
      'Email confirmation failed:',
      error,
    );

    return NextResponse.redirect(
      new URL(
        '/login?error=confirmation_failed',
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(next, request.url),
  );
}