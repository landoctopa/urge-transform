import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { requireCurrentUser } from '@/lib/auth';

export async function getAuthenticatedSupabase() {
  const user = await requireCurrentUser();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  return {
    user,
    supabase,
  };
}

export async function getProgramContentId(
  nodeKey: string,
): Promise<string> {
  const { supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('program_content')
    .select('id')
    .eq('node_key', nodeKey)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to resolve program node "${nodeKey}": ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      `Program node "${nodeKey}" does not exist`,
    );
  }

  return data.id;
}