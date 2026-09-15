'use server';

import {
  registerUser,
  type RegistrationIntent,
} from './register';

interface RegisterState {
  error: string | null;
  success: boolean;
  requiresConfirmation: boolean;
}

export const initialRegisterState: RegisterState = {
  error: null,
  success: false,
  requiresConfirmation: false,
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(
    formData.get('email') ?? '',
  ).trim();

  const password = String(
    formData.get('password') ?? '',
  );

  const rawIntent = String(
    formData.get('intent') ?? '',
  );

  const intent: RegistrationIntent =
    rawIntent === 'join'
      ? 'join'
      : 'trial';

  if (!email || !password) {
    return {
      error: 'Please complete all fields.',
      success: false,
      requiresConfirmation: false,
    };
  }

  if (password.length < 8) {
    return {
      error:
        'Password must be at least 8 characters.',
      success: false,
      requiresConfirmation: false,
    };
  }

  try {
    const result = await registerUser({
      email,
      password,
      intent,
    });

    return {
      error: null,
      success: true,
      requiresConfirmation: !result.session,
    };
  } catch (error) {
    console.error(
      'Registration failed:',
      error,
    );

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