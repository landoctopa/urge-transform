'use client';

import { useActionState, useState } from 'react';

import type { UserProfile } from '@/lib/auth/types';
import {
  COUNTRY_OPTIONS,
  getCountryCurrency,
} from '@/lib/geography/countries';
import { CURRENCY_OPTIONS } from '@/lib/geography/currencies';
import { completeProfileAction } from '@/lib/auth/profileActions';

interface ProfileCompletionFormProps {
  profile: UserProfile;
  intent: 'join' | 'trial' | null;
}

const initialState = {
  error: null,
  success: false,
};

const AGE_GROUPS = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55-64', label: '55–64' },
  { value: '65+', label: '65+' },
];

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export function ProfileCompletionForm({
  profile,
  intent,
}: ProfileCompletionFormProps) {
  const [state, formAction, isPending] = useActionState(
    completeProfileAction,
    initialState,
  );

  const [country, setCountry] = useState(
    profile.country ?? '',
  );

  const initialCurrency =
    profile.currency ??
    getCountryCurrency(profile.country) ??
    '';

  const [currency, setCurrency] = useState(
    initialCurrency,
  );

  /*
   * If the profile already has a currency, treat it as an
   * explicit choice. Otherwise, the currency starts as a
   * country-derived preselection.
   */
  const [currencyTouched, setCurrencyTouched] = useState(
    Boolean(profile.currency),
  );

  function handleCountryChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextCountry = event.target.value;

    setCountry(nextCountry);

    /*
     * Country only controls currency before the user has
     * explicitly chosen one.
     */
    if (!currencyTouched) {
      const nextCurrency =
        getCountryCurrency(nextCountry);

      if (nextCurrency) {
        setCurrency(nextCurrency);
      }
    }
  }

  function handleCurrencyChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setCurrency(event.target.value);
    setCurrencyTouched(true);
  }

  return (
    <div className="space-y-12">
      {/* Intro */}
      <header className="max-w-2xl">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          A little more about you
        </p>

        <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
          Let&apos;s set up your profile.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          This helps us make Urge more relevant to you.
          You can change these details later.
        </p>
      </header>

      <form action={formAction} className="space-y-10">
        {/* Preserve the current conversion intent */}
        {intent && (
          <input
            type="hidden"
            name="intent"
            value={intent}
          />
        )}

        {/* Age + Gender */}
        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ageGroup"
              className="mb-3 block text-sm font-medium"
            >
              Age group
            </label>

            <select
              id="ageGroup"
              name="ageGroup"
              defaultValue={profile.age_group ?? ''}
              required
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option value="" disabled>
                Select your age group
              </option>

              {AGE_GROUPS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-3 block text-sm font-medium"
            >
              Gender
              <span className="ml-2 font-normal text-muted-foreground">
                Optional
              </span>
            </label>

            <select
              id="gender"
              name="gender"
              defaultValue={profile.gender ?? ''}
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option value="">
                Prefer not to specify
              </option>

              {GENDER_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Country + City */}
        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="mb-3 block text-sm font-medium"
            >
              Country
            </label>

            <select
              id="country"
              name="country"
              value={country}
              onChange={handleCountryChange}
              required
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option value="" disabled>
                Select your country
              </option>

              {COUNTRY_OPTIONS.map((option) => (
                <option
                  key={option.code}
                  value={option.code}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-3 block text-sm font-medium"
            >
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              defaultValue={profile.city ?? ''}
              placeholder="e.g. Bengaluru"
              required
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            />
          </div>
        </section>

        {/* Currency */}
        <section>
          <div className="max-w-2xl">
            <label
              htmlFor="currency"
              className="mb-3 block text-sm font-medium"
            >
              Currency
            </label>

            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              We&apos;ll use this when talking about money
              throughout your Urge journey. You can change it
              anytime.
            </p>
          </div>

          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={handleCurrencyChange}
            required
            className="h-14 w-full max-w-2xl rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
          >
            <option value="" disabled>
              Select your currency
            </option>

            {CURRENCY_OPTIONS.map((option) => (
              <option
                key={option.code}
                value={option.code}
              >
                {option.symbol} {option.code} — {option.name}
              </option>
            ))}
          </select>
        </section>

        {/* Mobile */}
        <section>
          <div className="max-w-2xl">
            <label
              htmlFor="mobileNumber"
              className="mb-3 block text-sm font-medium"
            >
              Mobile number
              <span className="ml-2 font-normal text-muted-foreground">
                Optional
              </span>
            </label>

            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              We may use this for important Urge updates and,
              eventually, WhatsApp notifications.
            </p>
          </div>

          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            defaultValue={profile.mobile_number ?? ''}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className="h-14 w-full max-w-2xl rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
          />
        </section>

        {/* Error */}
        {state.error && (
          <p
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {state.error}
          </p>
        )}

        {/* Submit */}
        <div className="border-t border-border pt-8">
          <button
            type="submit"
            disabled={isPending}
            className="h-14 w-full max-w-2xl rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:text-lg"
          >
            {isPending
              ? 'Saving your profile…'
              : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}