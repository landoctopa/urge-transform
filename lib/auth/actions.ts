'use server';
import { redirect } from 'next/navigation';
import { registerUser, type RegistrationIntent} from './register';
import {loginUser, type LoginInput} from './login';
import type { RegisterState, LoginState } from './types';

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
      error: 'Password must be at least 8 characters.',
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
    console.error('Registration failed:', error);

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

function getSafeRedirect(
  value: string,
) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//')
  ) {
    return '/dashboard';
  }

  return value;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(
    formData.get('email') ?? '',
  ).trim();

  const password = String(
    formData.get('password') ?? '',
  );

  const next = getSafeRedirect(
    String(
      formData.get('next') ?? '',
    ),
  );

  if (!email || !password) {
    return {
      error: 'Please enter your email and password.',
      success: false,
    };
  }

  try {
    await loginUser({
      email,
      password,
    });
  } catch (error) {
    console.error(
      'Login failed:',
      error,
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while signing you in.',
      success: false,
    };
  }

  redirect(next);
}