import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/currentUser';
import { getOfferingForCheckout } from '@/lib/commerce/catalog';

import { Checkout } from '@/components/commerce/Checkout';

interface CheckoutPageProps {
  searchParams: Promise<{
    offering?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/register?intent=join');
  }

  const params = await searchParams;

  const offeringSlug = params.offering;

  if (!offeringSlug) {
    redirect('/');
  }

  const checkoutData =
    await getOfferingForCheckout(offeringSlug);

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <Checkout
          offering={checkoutData.offering}
          prices={checkoutData.prices}
        />
      </div>
    </main>
  );
}