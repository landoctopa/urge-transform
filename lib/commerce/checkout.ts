import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export interface CreateCheckoutInput {
  offeringSlug: string;
  priceId: string;
  discountCode?: string;
}

export async function createCheckout(
  input: CreateCheckoutInput,
) {
  const offeringSlug = input.offeringSlug.trim();
  const priceId = input.priceId.trim();
  const discountCode = input.discountCode?.trim() || null;

  if (!offeringSlug || !priceId) {
    throw new Error('Offering and price are required.');
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Confirm that the request is authenticated.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Authentication required.');
  }

  const { data, error } = await supabase.rpc(
    'create_checkout',
    {
      p_offering_slug: offeringSlug,
      p_price_id: priceId,
      p_discount_code: discountCode,
    },
  );

  if (error) {
    console.error('Checkout RPC failed:', error);

    throw new Error(
      error.message || 'Unable to complete checkout.',
    );
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Checkout returned an invalid response.');
  }

  return data;
}