export interface PriceCalculation {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface CreateCheckoutInput {
  offeringSlug: string;
  priceId: string;
  discountCode?: string;
}