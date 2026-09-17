import { NextResponse } from 'next/server';

import { createCheckout } from '@/lib/commerce/checkout';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const offeringSlug =
      typeof body.offeringSlug === 'string'
        ? body.offeringSlug.trim()
        : '';

    const priceId =
      typeof body.priceId === 'string'
        ? body.priceId.trim()
        : '';

    const discountCode =
      typeof body.discountCode === 'string'
        ? body.discountCode.trim()
        : '';

    if (!offeringSlug || !priceId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Offering and price are required.',
        },
        { status: 400 },
      );
    }

    const result = await createCheckout({
      offeringSlug,
      priceId,
      discountCode: discountCode || undefined,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      'Checkout failed:',
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to complete checkout.',
      },
      { status: 500 },
    );
  }
}