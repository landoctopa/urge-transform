'use server';

import { getCurrency } from '@/lib/geography/currencies';
import { getCountry } from '@/lib/geography/countries';

import {
  createCurrentProfile,
  getCurrentProfile,
  updateCurrentProfile,
} from './profile';

const AGE_GROUPS = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
] as const;

const GENDER_OPTIONS = [
  'female',
  'male',
  'non_binary',
  'prefer_not_to_say',
] as const;

const USERNAME_REGEX =
  /^[A-Za-z0-9_-]{3,30}$/;

interface ProfileCompletionState {
  error: string | null;
  success: boolean;
}

export async function completeProfileAction(
  _prevState: ProfileCompletionState,
  formData: FormData,
): Promise<ProfileCompletionState> {
  const username = String(
    formData.get('username') ?? '',
  ).trim();

  const ageGroup = String(
    formData.get('ageGroup') ?? '',
  ).trim();

  const gender = String(
    formData.get('gender') ?? '',
  ).trim();

  const country = String(
    formData.get('country') ?? '',
  ).trim();

  const city = String(
    formData.get('city') ?? '',
  ).trim();

  const mobileNumber = String(
    formData.get('mobileNumber') ?? '',
  ).trim();

  const currency = String(
    formData.get('currency') ?? '',
  ).trim();

  if (!USERNAME_REGEX.test(username)) {
    return {
      error:
        'Username must be 3–30 characters and use only letters, numbers, underscores, or hyphens.',
      success: false,
    };
  }

  if (
    !AGE_GROUPS.includes(
      ageGroup as (typeof AGE_GROUPS)[number],
    )
  ) {
    return {
      error:
        'Please select your age group.',
      success: false,
    };
  }

  if (
    gender &&
    !GENDER_OPTIONS.includes(
      gender as (typeof GENDER_OPTIONS)[number],
    )
  ) {
    return {
      error:
        'Please select a valid gender.',
      success: false,
    };
  }

  if (
    !country ||
    !getCountry(country)
  ) {
    return {
      error:
        'Please select a valid country.',
      success: false,
    };
  }

  if (!city) {
    return {
      error:
        'Please enter your city.',
      success: false,
    };
  }

  if (
    !currency ||
    !getCurrency(currency)
  ) {
    return {
      error:
        'Please select a valid currency.',
      success: false,
    };
  }

  if (
    mobileNumber &&
    !/^[+0-9()\s-]{7,20}$/.test(
      mobileNumber,
    )
  ) {
    return {
      error:
        'Please enter a valid mobile number.',
      success: false,
    };
  }

  try {
    const existingProfile =
      await getCurrentProfile();

    const values = {
      username,
      username_key:
        username.toLowerCase(),
      age_group: ageGroup,
      gender: gender || null,
      country,
      city,
      mobile_number:
        mobileNumber || null,
      currency,
    };

    if (existingProfile) {
      await updateCurrentProfile(
        values,
      );
    } else {
      await createCurrentProfile(
        values,
      );
    }

    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error(
      'Profile completion failed:',
      error,
    );

    if (
      error instanceof Error &&
      (
        error.message.includes(
          'duplicate key',
        ) ||
        error.message.includes(
          'user_profile_username_key_unique',
        )
      )
    ) {
      return {
        error:
          'That username is already taken.',
        success: false,
      };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving your profile.',
      success: false,
    };
  }
}