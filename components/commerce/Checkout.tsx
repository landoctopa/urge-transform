'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, Tag } from 'lucide-react';

import type { Database } from '@/types/supabase';

type Offering =
  Database['public']['Tables']['offerings']['Row'];

type OfferingPrice =
  Database['public']['Tables']['offering_prices']['Row'];

interface CheckoutProps {
  offering: Offering;
  prices: OfferingPrice[];
}

function formatCurrency(
  amount: number,
  currency: string,
) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getBillingLabel(price: OfferingPrice) {
  if (price.billing_interval === 'month') {
    if (price.billing_interval_count === 1) {
      return 'Billed monthly';
    }

    return `Billed every ${price.billing_interval_count} months`;
  }

  if (price.billing_interval === 'year') {
    if (price.billing_interval_count === 1) {
      return 'Billed annually';
    }

    return `Billed every ${price.billing_interval_count} years`;
  }

  return 'Recurring';
}

function getMonthlyEquivalent(price: OfferingPrice) {
  if (!price.access_duration_months) {
    return null;
  }

  return Number(price.price) / price.access_duration_months;
}

export function Checkout({
  offering,
  prices,
}: CheckoutProps) {
  const [selectedPriceId, setSelectedPriceId] = useState(
    prices[0]?.id ?? '',
  );

  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState<string | null>(
    null,
  );
  const [discountValid, setDiscountValid] = useState(false);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const selectedPrice = useMemo(
    () =>
      prices.find(
        (price) => price.id === selectedPriceId,
      ) ?? null,
    [prices, selectedPriceId],
  );

  const subtotal = selectedPrice
    ? Number(selectedPrice.price)
    : 0;

  const discount = discountValid
    ? subtotal
    : 0;

  const total = Math.max(subtotal - discount, 0);

  async function handleApplyDiscount() {
    const code = discountCode.trim();

    if (!code || !selectedPrice) {
      return;
    }

    setCheckingDiscount(true);
    setDiscountMessage(null);
    setDiscountValid(false);

    try {
      const response = await fetch(
        '/api/commerce/discount',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offeringId: offering.id,
            code,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.valid) {
        setDiscountMessage(
          result.error ?? 'Invalid discount code.',
        );
        return;
      }

      setDiscountValid(true);
      setDiscountMessage(
        `${result.discount.name} applied — ${result.discount.value}% off.`,
      );
    } catch {
      setDiscountMessage(
        'Unable to validate the discount code.',
      );
    } finally {
      setCheckingDiscount(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          Join Urge
        </p>

        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
          Choose how you want to build.
        </h1>

        <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
          {offering.description}
        </p>
      </div>

      {/* Plans */}
      <section className="mt-14">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {prices.map((price) => {
            const selected =
              price.id === selectedPriceId;

            const monthlyEquivalent =
              getMonthlyEquivalent(price);

            return (
              <button
                key={price.id}
                type="button"
                onClick={() => {
                  setSelectedPriceId(price.id);
                  setDiscountValid(false);
                  setDiscountMessage(null);
                }}
                className={[
                  'relative min-h-[250px] bg-background p-7 text-left transition-all sm:p-8',
                  selected
                    ? 'z-10 ring-2 ring-primary'
                    : 'hover:bg-muted/30',
                ].join(' ')}
              >
                {selected && (
                  <span className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {price.name}
                </p>

                <div className="mt-8">
                  <span className="text-4xl font-semibold tracking-[-0.04em]">
                    {formatCurrency(
                      Number(price.price),
                      price.currency,
                    )}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  {getBillingLabel(price)}
                </p>

                {monthlyEquivalent !== null &&
                  price.access_duration_months !== 1 && (
                    <p className="mt-6 text-sm font-medium text-primary">
                      {formatCurrency(
                        monthlyEquivalent,
                        price.currency,
                      )}
                      / month equivalent
                    </p>
                  )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Checkout summary */}
      <section className="mt-12 grid gap-10 border-t border-border pt-12 md:grid-cols-[1fr_360px]">
        {/* Discount */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Discount code
          </p>

          <div className="mt-5 flex max-w-lg gap-3">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={discountCode}
                onChange={(event) => {
                  setDiscountCode(event.target.value);
                  setDiscountValid(false);
                  setDiscountMessage(null);
                }}
                placeholder="Enter a code"
                className="h-12 w-full border border-input bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyDiscount}
              disabled={
                !discountCode.trim() ||
                !selectedPrice ||
                checkingDiscount
              }
              className="inline-flex h-12 items-center justify-center gap-2 bg-foreground px-6 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {checkingDiscount ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {discountMessage && (
            <p
              className={[
                'mt-4 text-sm',
                discountValid
                  ? 'text-primary'
                  : 'text-destructive',
              ].join(' ')}
            >
              {discountMessage}
            </p>
          )}

          <div className="mt-12 max-w-xl">
            <h2 className="text-xl font-medium tracking-[-0.025em]">
              What your membership includes
            </h2>

            <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              {[
                'The complete Urge program',
                'Community and accountability',
                'Live sessions and standups',
                'Access to mentors and experts',
                'Tools and resources',
                'The wider Urge ecosystem',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary */}
        <aside className="self-start border border-border p-7 sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Order summary
          </p>

          <h2 className="mt-5 text-xl font-medium">
            {selectedPrice?.name ?? 'Membership'}
          </h2>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Membership
              </span>

              <span>
                {selectedPrice
                  ? formatCurrency(
                      subtotal,
                      selectedPrice.currency,
                    )
                  : '—'}
              </span>
            </div>

            {discountValid && (
              <div className="flex justify-between gap-4 text-primary">
                <span>Discount</span>
                <span>
                  −
                  {selectedPrice
                    ? formatCurrency(
                        discount,
                        selectedPrice.currency,
                      )
                    : '—'}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex items-end justify-between gap-4">
                <span className="font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold tracking-[-0.03em]">
                  {selectedPrice
                    ? formatCurrency(
                        total,
                        selectedPrice.currency,
                      )
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedPrice}
            className="mt-8 flex w-full items-center justify-between bg-primary px-5 py-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              {total === 0
                ? 'Continue'
                : 'Continue to payment'}
            </span>

            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Your membership renews automatically according
            to the plan you select.
          </p>
        </aside>
      </section>
    </div>
  );
}