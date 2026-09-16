import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,30}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawUsername = searchParams.get('username') ?? '';
  const username = rawUsername.trim();

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({
      valid: false,
      available: false,
    });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.rpc(
    'is_username_available',
    {
      candidate: username,
    },
  );

  if (error) {
    console.error(
      'Username availability check failed:',
      error,
    );

    return NextResponse.json(
      {
        valid: true,
        available: false,
        error: 'Unable to check username availability.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    valid: true,
    available: data === true,
  });
}