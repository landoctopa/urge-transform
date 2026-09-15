'use server';

import { registerUser } from './register';

export async function registerAction(
  _prevState: {
    error: string | null;
    success: boolean;
    requiresConfirmation: boolean;
  },
  formData: FormData,
) {
  const username = String(formData.get('username') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!username || !email || !password) {
    return {
      error: 'Please complete all fields.',
      success: false,
      requiresConfirmation: false,
    };
  }

  if (!/^[A-Za-z0-9_-]{3,30}$/.test(username)) {
    return {
      error:
        'Username must be 3–30 characters and use only letters, numbers, underscores, or hyphens.',
      success: false,
      requiresConfirmation: false,
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters.',
      success: false,
      requiresConfirmation: false,
    };
  }

  try {
    const result = await registerUser({
      username,
      email,
      password,
    });

    return {
      error: null,
      success: true,
      requiresConfirmation: !result.session,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while creating your account.',
      success: false,
      requiresConfirmation: false,
    };
  }
}