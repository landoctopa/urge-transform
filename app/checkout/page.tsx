import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/currentUser';
import { getUrgeMembership } from '@/lib/commerce/catalog';

import { Checkout } from '@/components/commerce/Checkout';

interface CheckoutPageProps {
  searchParams: Promise<{
    intent?: string;
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

  const intent =
    params.intent === 'join'
      ? 'join'
      : 'trial';

  const membership = await getUrgeMembership();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <Checkout
          offering={membership.offering}
          prices={membership.prices}
          intent={intent}
        />
      </div>
    </main>
  );
}