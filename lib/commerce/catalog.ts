import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export async function getOfferingForCheckout(
  offeringSlug: string,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: offering, error: offeringError } =
    await supabase
      .from('offerings')
      .select('*')
      .eq('slug', offeringSlug)
      .eq('availability_status', 'active')
      .single();

  if (offeringError) {
    throw new Error(
      `Failed to load offering: ${offeringError.message}`,
    );
  }

  const { data: prices, error: pricesError } =
    await supabase
      .from('offering_prices')
      .select('*')
      .eq('offering_id', offering.id)
      .eq('status', 'active')
      .order('access_duration_months', {
        ascending: true,
      });

  if (pricesError) {
    throw new Error(
      `Failed to load offering prices: ${pricesError.message}`,
    );
  }

  return {
    offering,
    prices,
  };
}