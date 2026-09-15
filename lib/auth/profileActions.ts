'use server';

import { getCurrency } from '@/lib/geography/currencies';
import { getCountry } from '@/lib/geography/countries';
import { updateCurrentProfile } from './profile';

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

 interface ProfileCompletionState {
  error: string | null;
  success: boolean;
}

 const initialProfileCompletionState: ProfileCompletionState = {
  error: null,
  success: false,
};

export async function completeProfileAction(
  _prevState: ProfileCompletionState,
  formData: FormData,
): Promise<ProfileCompletionState> {
  const ageGroup = String(formData.get('ageGroup') ?? '').trim();
  const gender = String(formData.get('gender') ?? '').trim();
  const country = String(formData.get('country') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const mobileNumber = String(
    formData.get('mobileNumber') ?? '',
  ).trim();
  const currency = String(formData.get('currency') ?? '').trim();

  if (
    !AGE_GROUPS.includes(
      ageGroup as (typeof AGE_GROUPS)[number],
    )
  ) {
    return {
      error: 'Please select your age group.',
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
      error: 'Please select a valid gender.',
      success: false,
    };
  }

  if (!country || !getCountry(country)) {
    return {
      error: 'Please select a valid country.',
      success: false,
    };
  }

  if (!city) {
    return {
      error: 'Please enter your city.',
      success: false,
    };
  }

  if (!currency || !getCurrency(currency)) {
    return {
      error: 'Please select a valid currency.',
      success: false,
    };
  }

  if (mobileNumber && !/^[+0-9()\s-]{7,20}$/.test(mobileNumber)) {
    return {
      error: 'Please enter a valid mobile number.',
      success: false,
    };
  }

  try {
    await updateCurrentProfile({
      age_group: ageGroup,
      gender: gender || null,
      country,
      city,
      mobile_number: mobileNumber || null,
      currency,
    });

    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error('Profile completion failed:', error);

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving your profile.',
      success: false,
    };
  }
}