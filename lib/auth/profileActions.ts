'use server';

import type { Database } from '@/types/supabase';

import { getCurrency } from '@/lib/geography/currencies';
import { getCountry } from '@/lib/geography/countries';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validation/profile';

import {
  createCurrentProfile,
  getCurrentProfile,
  updateCurrentProfile,
} from './profile';

export interface ProfileCompletionState {
  error: string | null;
  success: boolean;
}

type UserProfileInsert =
  Database['public']['Tables']['user_profile']['Insert'];

type UserProfileUpdate =
  Database['public']['Tables']['user_profile']['Update'];

export async function completeProfileAction(
  values: ProfileFormValues,
): Promise<ProfileCompletionState> {
  const parsed =
    profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        'Please check your profile details.',
      success: false,
    };
  }

  const profile = parsed.data;

  /*
   * These are domain-level checks.
   * Zod validates the form shape;
   * these validate against our actual
   * country and currency data.
   */

  if (!getCountry(profile.country)) {
    return {
      error: 'Please select a valid country.',
      success: false,
    };
  }

  if (!getCurrency(profile.currency)) {
    return {
      error: 'Please select a valid currency.',
      success: false,
    };
  }

  try {
    const existingProfile =
      await getCurrentProfile();

    const profileValues:
      | UserProfileInsert
      | UserProfileUpdate = {
      username: profile.username,
      username_key:
        profile.username.toLowerCase(),
      age_group: profile.ageGroup,
      gender: profile.gender || null,
      country: profile.country,
      city: profile.city,
      mobile_number:
        profile.mobileNumber || null,
      currency: profile.currency,
    };

    if (existingProfile) {
      await updateCurrentProfile(
        profileValues as UserProfileUpdate,
      );
    } else {
      await createCurrentProfile(
        profileValues as Omit<
          UserProfileInsert,
          'user_id'
        >,
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