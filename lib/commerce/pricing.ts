import 'server-only';

import type { Database } from '@/types/supabase';
import { PriceCalculation } from './types';

type OfferingPrice = Database['public']['Tables']['offering_prices']['Row'];

type Discount = Database['public']['Tables']['discounts']['Row'];



export function calculatePrice(
  price: OfferingPrice,
  discount: Discount | null = null,
): PriceCalculation {
  const subtotal = Number(price.price);

  let discountAmount = 0;

  if (discount) {
    if (discount.discount_type === 'percentage') {
      discountAmount =
        subtotal * (Number(discount.value) / 100);
    }

    if (discount.discount_type === 'fixed') {
      discountAmount = Number(discount.value);
    }
  }

  // Never allow a discount to exceed the subtotal.
  discountAmount = Math.min( Math.max(discountAmount, 0),subtotal);

  const tax = 0;

  const total = Math.max(subtotal - discountAmount + tax,0);

  return {
    subtotal,
    discount: discountAmount,
    tax,
    total,
  };
}