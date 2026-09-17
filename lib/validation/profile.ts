import { z } from 'zod';

export const AGE_GROUPS = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
] as const;

export const GENDER_OPTIONS = [
  'female',
  'male',
  'non_binary',
  'prefer_not_to_say',
] as const;

const USERNAME_REGEX =
  /^[A-Za-z0-9_-]{3,30}$/;

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(
      3,
      'Username must be at least 3 characters.',
    )
    .max(
      30,
      'Username must be 30 characters or fewer.',
    )
    .regex(
      USERNAME_REGEX,
      'Username can only use letters, numbers, underscores, and hyphens.',
    ),

  ageGroup: z.enum(AGE_GROUPS, {
    error: 'Please select your age group.',
  }),

  gender: z.union([
    z.enum(GENDER_OPTIONS),
    z.literal(''),
  ]),

  country: z
    .string()
    .trim()
    .min(
      1,
      'Please select your country.',
    ),

  city: z
    .string()
    .trim()
    .min(
      1,
      'Please enter your city.',
    ),

  currency: z
    .string()
    .trim()
    .min(
      1,
      'Please select your currency.',
    ),

  mobileNumber: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === '' ||
        /^[+0-9()\s-]{7,20}$/.test(value),
      'Please enter a valid mobile number.',
    ),
});

export type ProfileFormValues =
  z.infer<typeof profileSchema>;