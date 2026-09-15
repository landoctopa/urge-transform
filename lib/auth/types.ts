import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';


export type UserProfile = Database['public']['Tables']['user_profile']['Row'];


export interface CurrentUser {
  auth: User;
  profile: UserProfile | null;
}

export interface RegisterState {
  error: string | null;
  success: boolean;
  requiresConfirmation: boolean;
}

export const initialRegisterState: RegisterState = {
  error: null,
  success: false,
  requiresConfirmation: false,
};