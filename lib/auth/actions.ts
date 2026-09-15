'use server';

import { registerUser } from './register';

export type RegisterActionState = {
  error: string | null;
  success: boolean;
  requiresConfirmation: boolean;
};

export const initialRegisterState: RegisterActionState = {
  error: null,
  success: false,
  requiresConfirmation: false,
};

export async function registerAction(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const username = String(formData.get('username') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!username || !email || !password) {
    return {
      ...initialRegisterState,
      error: 'Please complete all fields.',
    };
  }

  if (username.length < 3) {
    return {
      ...initialRegisterState,
      error: 'Username must be at least 3 characters.',
    };
  }

  if (password.length < 8) {
    return {
      ...initialRegisterState,
      error: 'Password must be at least 8 characters.',
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
      ...initialRegisterState,
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while creating your account.',
    };
  }
}