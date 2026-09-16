import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth/currentUser';
import { validateDiscountCode } from '@/lib/commerce/discounts';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        valid: false,
        error: 'You must be signed in.',
      },
      { status: 401 },
    );
  }

  let body: {
    offeringId?: string;
    code?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        valid: false,
        error: 'Invalid request.',
      },
      { status: 400 },
    );
  }

  const offeringId = body.offeringId?.trim();
  const code = body.code?.trim();

  if (!offeringId || !code) {
    return NextResponse.json(
      {
        valid: false,
        error: 'Offering and discount code are required.',
      },
      { status: 400 },
    );
  }

  try {
    const discount = await validateDiscountCode(
      offeringId,
      code,
    );

    if (!discount) {
      return NextResponse.json({
        valid: false,
        error: 'That discount code is not valid.',
      });
    }

    return NextResponse.json({
      valid: true,
      discount: {
        id: discount.id,
        name: discount.name,
        discount_type: discount.discount_type,
        value: Number(discount.value),
      },
    });
  } catch (error) {
    console.error(
      'Discount validation failed:',
      error,
    );

    return NextResponse.json(
      {
        valid: false,
        error: 'Unable to validate discount code.',
      },
      { status: 500 },
    );
  }
}