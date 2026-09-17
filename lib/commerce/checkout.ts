import 'server-only';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

import { validateDiscountCode } from './discounts';
import { calculatePrice } from './pricing';
import { CreateCheckoutInput } from './types';


export async function createCheckout(input: CreateCheckoutInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // ----------------------------------------------------------
  // 1. Authenticate
  // ----------------------------------------------------------

  const {data: { user },error: userError} = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be signed in to checkout.');
  }

  // ----------------------------------------------------------
  // 2. Load the offering
  // ----------------------------------------------------------

  const { data: offering, error: offeringError } =
    await supabase
      .from('offerings')
      .select('*')
      .eq('slug', input.offeringSlug)
      .eq('availability_status', 'active')
      .single();

  if (offeringError || !offering) {
    throw new Error('The selected offering is not available.');
  }

  // ----------------------------------------------------------
  // 3. Load the selected price
  // ----------------------------------------------------------

  const { data: price, error: priceError } =
    await supabase
      .from('offering_prices')
      .select('*')
      .eq('id', input.priceId)
      .eq('offering_id', offering.id)
      .eq('status', 'active')
      .single();

  if (priceError || !price) {
    throw new Error('The selected price is not available.');
  }

  // ----------------------------------------------------------
  // 4. Validate discount
  // ----------------------------------------------------------

  let discount = null;

  if (input.discountCode?.trim()) {
    discount = await validateDiscountCode(
      offering.id,
      input.discountCode,
    );

    if (!discount) {
      throw new Error('That discount code is not valid.');
    }
  }

  // ----------------------------------------------------------
  // 5. Calculate the authoritative price
  // ----------------------------------------------------------

  const calculation = calculatePrice(price,discount);

  // ----------------------------------------------------------
  // 6. Create the order
  // ----------------------------------------------------------

  const { data: order, error: orderError } =
    await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        currency: price.currency,
        subtotal: calculation.subtotal,
        discount: calculation.discount,
        tax: calculation.tax,
        total: calculation.total,
      })
      .select('*')
      .single();

  if (orderError || !order) {
    throw new Error(
      `Failed to create order: ${
        orderError?.message ?? 'Unknown error'
      }`,
    );
  }

  // ----------------------------------------------------------
  // 7. Create the order item
  // ----------------------------------------------------------

  const { data: orderItem, error: orderItemError } =
    await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        offering_id: offering.id,
        offering_price_id: price.id,
        name: `${offering.name} — ${price.name}`,
        quantity: 1,
        unit_price: calculation.subtotal,
        discount: calculation.discount,
        total_price: calculation.total,
      })
      .select('*')
      .single();

  if (orderItemError || !orderItem) {
    throw new Error(
      `Failed to create order item: ${
        orderItemError?.message ?? 'Unknown error'
      }`,
    );
  }

  // ----------------------------------------------------------
  // 8. Stop here for a real payment
  // ----------------------------------------------------------

  if (calculation.total > 0) {
    return {
      status: 'payment_required' as const,
      order,
      orderItem,
      calculation,
    };
  }

  // ----------------------------------------------------------
  // 9. Dummy payment for zero-value orders
  // ----------------------------------------------------------

  const { data: transaction, error: transactionError } =
    await supabase
      .from('transactions')
      .insert({
        order_id: order.id,
        user_id: user.id,
        type: 'payment',
        provider: 'dummy',
        provider_transaction_id: `dummy_${order.id}`,
        amount: calculation.total,
        currency: price.currency,
        status: 'paid',
      })
      .select('*')
      .single();

  if (transactionError || !transaction) {
    throw new Error(
      `Failed to create transaction: ${
        transactionError?.message ?? 'Unknown error'
      }`,
    );
  }

  // ----------------------------------------------------------
  // 10. Mark order paid
  // ----------------------------------------------------------

  const { data: paidOrder, error: paidOrderError } =
    await supabase
      .from('orders')
      .update({
        status: 'paid',
      })
      .eq('id', order.id)
      .eq('user_id', user.id)
      .select('*')
      .single();

  if (paidOrderError || !paidOrder) {
    throw new Error(
      `Failed to mark order as paid: ${
        paidOrderError?.message ?? 'Unknown error'
      }`,
    );
  }

  // ----------------------------------------------------------
  // 11. Create subscription
  // ----------------------------------------------------------

  const { data: subscription, error: subscriptionError } =
    await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        offering_price_id: price.id,
        provider: 'dummy',
        provider_subscription_id: `dummy_sub_${order.id}`,
        status: 'active',
        current_period_start: new Date().toISOString(),
        metadata: {
          order_id: order.id,
          transaction_id: transaction.id,
          test: true,
        },
      })
      .select('*')
      .single();

  if (subscriptionError || !subscription) {
    throw new Error(
      `Failed to create subscription: ${
        subscriptionError?.message ?? 'Unknown error'
      }`,
    );
  }

  // ----------------------------------------------------------
  // 12. Create entitlement
  // ----------------------------------------------------------

  const startsAt = new Date();
  const expiresAt = new Date(startsAt);

  if (price.access_duration_months) {
    expiresAt.setMonth(
      expiresAt.getMonth() +
        price.access_duration_months,
    );
  }

  const { data: entitlement, error: entitlementError } =
    await supabase
      .from('entitlements')
      .insert({
        user_id: user.id,
        type: 'membership',
        scope: offering.slug,
        status: 'active',
        source_type: 'subscription',
        source_id: subscription.id,
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        metadata: {
          offering_id: offering.id,
          offering_price_id: price.id,
          order_id: order.id,
        },
      })
      .select('*')
      .single();

  if (entitlementError || !entitlement) {
    throw new Error(
      `Failed to create entitlement: ${
        entitlementError?.message ?? 'Unknown error'
      }`,
    );
  }

  return {
    status: 'completed' as const,
    order: paidOrder,
    orderItem,
    transaction,
    subscription,
    entitlement,
    calculation,
  };
}