'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import {
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { UserProfile } from '@/lib/auth/types';

import {
  COUNTRY_OPTIONS,
  getCountryCurrency,
} from '@/lib/geography/countries';

import { CURRENCY_OPTIONS } from '@/lib/geography/currencies';

import {
  completeProfileAction,
  type ProfileCompletionState,
} from '@/lib/auth/profileActions';

import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validation/profile';

interface ProfileCompletionFormProps {
  profile: UserProfile | null;
  intent: 'join' | 'trial';
}

const AGE_GROUPS = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55-64', label: '55–64' },
  { value: '65+', label: '65+' },
] as const;

const GENDER_OPTIONS = [
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'non_binary',
    label: 'Non-binary',
  },
  {
    value: 'prefer_not_to_say',
    label: 'Prefer not to say',
  },
] as const;

const USERNAME_REGEX =
  /^[A-Za-z0-9_-]{3,30}$/;

function getAgeGroupValue(
  value: string | null | undefined,
): ProfileFormValues['ageGroup'] | undefined {
  if (
    AGE_GROUPS.some(
      (option) => option.value === value,
    )
  ) {
    return value as ProfileFormValues['ageGroup'];
  }

  return undefined;
}

function getGenderValue(
  value: string | null | undefined,
): ProfileFormValues['gender'] {
  if (
    GENDER_OPTIONS.some(
      (option) => option.value === value,
    )
  ) {
    return value as ProfileFormValues['gender'];
  }

  return '';
}

type UsernameStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'taken'
  | 'invalid'
  | 'error';

const MAX_AVATAR_SIZE =
  2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export function ProfileCompletionForm({
  profile,
  intent,
}: ProfileCompletionFormProps) {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [
    usernameStatus,
    setUsernameStatus,
  ] = useState<UsernameStatus>(
    profile?.username
      ? 'available'
      : 'idle',
  );

  const [
    currencyTouched,
    setCurrencyTouched,
  ] = useState(
    Boolean(profile?.currency),
  );

  const [
    avatarPreview,
    setAvatarPreview,
  ] = useState<string | null>(null);

  const [
    avatarUploading,
    setAvatarUploading,
  ] = useState(false);

  const [
    avatarError,
    setAvatarError,
  ] = useState<string | null>(null);

  const avatarInputRef =
    useRef<HTMLInputElement>(null);

  const usernameRequestRef =
    useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    ProfileFormValues,
    unknown,
    ProfileFormValues
  >({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      username:
        profile?.username ?? '',

      ageGroup:
        getAgeGroupValue(
          profile?.age_group,
        ),

      gender:
        getGenderValue(
          profile?.gender,
        ),

      country:
        profile?.country ?? '',

      city:
        profile?.city ?? '',

      currency:
        profile?.currency ??
        getCountryCurrency(
          profile?.country,
        ) ??
        '',

      mobileNumber:
        profile?.mobile_number ?? '',
    },
  });

  const username =
    watch('username');

  const country =
    watch('country');

  const currency =
    watch('currency');

  const selectedCountryCurrency =
    useMemo(
      () =>
        getCountryCurrency(country),
      [country],
    );

  /*
   * ----------------------------------------------------------
   * Username availability
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const value =
      username.trim();

    if (!value) {
      setUsernameStatus('idle');
      return;
    }

    if (!USERNAME_REGEX.test(value)) {
      setUsernameStatus('invalid');
      return;
    }

    /*
     * Existing username belonging
     * to this profile is valid.
     */
    if (
      profile?.username &&
      value === profile.username
    ) {
      setUsernameStatus('available');
      return;
    }

    const requestId =
      ++usernameRequestRef.current;

    setUsernameStatus('checking');

    const timeout =
      window.setTimeout(
        async () => {
          try {
            const response =
              await fetch(
                `/api/username/availability?username=${encodeURIComponent(
                  value,
                )}`,
              );

            if (
              requestId !==
              usernameRequestRef.current
            ) {
              return;
            }

            if (!response.ok) {
              setUsernameStatus('error');
              return;
            }

            const result =
              await response.json();

            if (
              requestId !==
              usernameRequestRef.current
            ) {
              return;
            }

            setUsernameStatus(
              result.available
                ? 'available'
                : 'taken',
            );
          } catch {
            if (
              requestId ===
              usernameRequestRef.current
            ) {
              setUsernameStatus('error');
            }
          }
        },
        350,
      );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    username,
    profile?.username,
  ]);

  /*
   * ----------------------------------------------------------
   * Avatar upload
   * ----------------------------------------------------------
   */

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarError(null);

    if (
      !ALLOWED_AVATAR_TYPES.has(
        file.type,
      )
    ) {
      setAvatarError(
        'Please upload a PNG, JPEG, or WebP image.',
      );

      event.target.value = '';
      return;
    }

    if (
      file.size > MAX_AVATAR_SIZE
    ) {
      setAvatarError(
        'Your profile picture must be 2 MB or smaller.',
      );

      event.target.value = '';
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
    setAvatarUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        'file',
        file,
      );

      const response =
        await fetch(
          '/api/profile/avatar',
          {
            method: 'POST',
            body: formData,
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setAvatarPreview(null);

        setAvatarError(
          result.error ??
            'Unable to upload your profile picture.',
        );

        return;
      }
    } catch {
      setAvatarPreview(null);

      setAvatarError(
        'Unable to upload your profile picture.',
      );
    } finally {
      setAvatarUploading(false);
    }
  }

  /*
   * ----------------------------------------------------------
   * Country → currency
   * ----------------------------------------------------------
   */

  function handleCountryChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextCountry =
      event.target.value;

    setValue(
      'country',
      nextCountry,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    if (
      !currencyTouched &&
      selectedCountryCurrency
    ) {
      setValue(
        'currency',
        selectedCountryCurrency,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }
  }

  /*
   * ----------------------------------------------------------
   * Profile submission
   * ----------------------------------------------------------
   */

  const onSubmit:
    SubmitHandler<ProfileFormValues> =
    async (values) => {
      setServerError(null);

      if (
        usernameStatus !==
        'available'
      ) {
        setServerError(
          'Please choose an available username.',
        );
        return;
      }

      const result:
        ProfileCompletionState =
        await completeProfileAction(
          values,
        );

      if (!result.success) {
        setServerError(
          result.error ??
            'Unable to save your profile.',
        );

        return;
      }

      router.push(
        `/profile/complete/success?intent=${intent}`,
      );
    };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          A little more about you
        </p>

        <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Let&apos;s set up your profile.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          This helps us make Urge more relevant
          to you. You can change these details
          later.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* Profile picture */}
        <section>
          <label
            htmlFor="avatar"
            className="mb-3 block text-sm font-medium"
          >
            Profile picture
            <span className="ml-2 font-normal text-muted-foreground">
              Optional
            </span>
          </label>

          <p className="mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add a picture so people can recognize
            you inside Urge.
          </p>

          <input
            ref={avatarInputRef}
            id="avatar"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarChange}
            disabled={
              isSubmitting ||
              avatarUploading
            }
            className="sr-only"
          />

          <button
            type="button"
            onClick={() =>
              avatarInputRef.current?.click()
            }
            disabled={
              isSubmitting ||
              avatarUploading
            }
            className="group block"
          >
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/30 transition-colors group-hover:border-primary">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile picture preview"
                  className="h-full w-full object-cover"
                />
              ) : profile?.avatar_path ? (
                <span className="px-4 text-center text-sm text-muted-foreground">
                  Current photo
                </span>
              ) : (
                <span className="text-4xl font-light text-muted-foreground">
                  +
                </span>
              )}
            </div>

            <span className="mt-3 block text-sm font-medium">
              {avatarUploading
                ? 'Uploading…'
                : profile?.avatar_path ||
                    avatarPreview
                  ? 'Change photo'
                  : 'Add a photo'}
            </span>
          </button>

          <p className="mt-2 text-xs text-muted-foreground">
            PNG, JPEG or WebP · Maximum 2 MB
          </p>

          {avatarError && (
            <p
              role="alert"
              className="mt-3 text-sm text-destructive"
            >
              {avatarError}
            </p>
          )}
        </section>

        {/* Username */}
        <section>
          <label
            htmlFor="username"
            className="mb-3 block text-sm font-medium"
          >
            Username
          </label>

          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            This is how you&apos;ll be known
            inside Urge.
          </p>

          <input
            id="username"
            type="text"
            placeholder="e.g. amit"
            autoComplete="username"
            disabled={isSubmitting}
            {...register('username')}
            className="h-14 w-full max-w-2xl rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
          />

          <div className="mt-2 min-h-5 text-xs">
            {usernameStatus ===
              'checking' && (
              <p className="text-muted-foreground">
                Checking availability…
              </p>
            )}

            {usernameStatus ===
              'available' && (
              <p className="text-primary">
                Username is available.
              </p>
            )}

            {usernameStatus ===
              'taken' && (
              <p className="text-destructive">
                That username is already taken.
              </p>
            )}

            {usernameStatus ===
              'invalid' && (
              <p className="text-muted-foreground">
                3–30 characters. Letters,
                numbers, underscores and
                hyphens only.
              </p>
            )}

            {usernameStatus ===
              'error' && (
              <p className="text-destructive">
                We couldn&apos;t check username
                availability.
              </p>
            )}

            {errors.username && (
              <p className="text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
        </section>

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
              disabled={isSubmitting}
              {...register('ageGroup')}
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option
                value=""
                disabled
              >
                Select your age group
              </option>

              {AGE_GROUPS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            {errors.ageGroup && (
              <p className="mt-2 text-xs text-destructive">
                {errors.ageGroup.message}
              </p>
            )}
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
              disabled={isSubmitting}
              {...register('gender')}
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option value="">
                Prefer not to specify
              </option>

              {GENDER_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            {errors.gender && (
              <p className="mt-2 text-xs text-destructive">
                {errors.gender.message}
              </p>
            )}
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
              value={country}
              onChange={handleCountryChange}
              disabled={isSubmitting}
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            >
              <option
                value=""
                disabled
              >
                Select your country
              </option>

              {COUNTRY_OPTIONS.map(
                (option) => (
                  <option
                    key={option.code}
                    value={option.code}
                  >
                    {option.name}
                  </option>
                ),
              )}
            </select>

            {errors.country && (
              <p className="mt-2 text-xs text-destructive">
                {errors.country.message}
              </p>
            )}
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
              type="text"
              placeholder="e.g. Bengaluru"
              disabled={isSubmitting}
              {...register('city')}
              className="h-14 w-full rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
            />

            {errors.city && (
              <p className="mt-2 text-xs text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>
        </section>

        {/* Currency */}
        <section>
          <label
            htmlFor="currency"
            className="mb-3 block text-sm font-medium"
          >
            Currency
          </label>

          <p className="mb-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            We&apos;ll use this when talking about
            money throughout your Urge journey.
            You can change it anytime.
          </p>

          <select
            id="currency"
            value={currency}
            onChange={(event) => {
              setValue(
                'currency',
                event.target.value,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );

              setCurrencyTouched(true);
            }}
            disabled={isSubmitting}
            className="h-14 w-full max-w-2xl rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
          >
            <option
              value=""
              disabled
            >
              Select your currency
            </option>

            {CURRENCY_OPTIONS.map(
              (option) => (
                <option
                  key={option.code}
                  value={option.code}
                >
                  {option.symbol}{' '}
                  {option.code} —{' '}
                  {option.name}
                </option>
              ),
            )}
          </select>

          {errors.currency && (
            <p className="mt-2 text-xs text-destructive">
              {errors.currency.message}
            </p>
          )}
        </section>

        {/* Mobile */}
        <section>
          <label
            htmlFor="mobileNumber"
            className="mb-3 block text-sm font-medium"
          >
            Mobile number
            <span className="ml-2 font-normal text-muted-foreground">
              Optional
            </span>
          </label>

          <p className="mb-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            We may use this for important Urge
            updates and, eventually, WhatsApp
            notifications.
          </p>

          <input
            id="mobileNumber"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            disabled={isSubmitting}
            {...register('mobileNumber')}
            className="h-14 w-full max-w-2xl rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:h-16 sm:text-lg"
          />

          {errors.mobileNumber && (
            <p className="mt-2 text-xs text-destructive">
              {errors.mobileNumber.message}
            </p>
          )}
        </section>

        {/* Server error */}
        {serverError && (
          <p
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {serverError}
          </p>
        )}

        {/* Submit */}
        <div className="border-t border-border pt-8">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              usernameStatus !==
                'available' ||
              avatarUploading
            }
            className="h-14 w-full max-w-2xl rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:text-lg"
          >
            {isSubmitting
              ? 'Saving your profile…'
              : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}