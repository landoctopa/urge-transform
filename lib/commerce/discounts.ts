import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

function escapeIlikePattern(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

export async function validateDiscountCode(
  offeringId: string,
  code: string,
) {
  const normalizedCode = code.trim().toLowerCase();

  if (!normalizedCode) {
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const now = new Date().toISOString();
  const pattern = escapeIlikePattern(normalizedCode);

  const { data: discount, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('offering_id', offeringId)
    .eq('status', 'active')
    .ilike('code', pattern)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to validate discount code: ${error.message}`,
    );
  }

  return discount;
}