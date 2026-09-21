import type { Database } from '@/types/supabase';

export type ObservationRow = Database['public']['Tables']['user_observations']['Row'];

export type ObservationInsert = Database['public']['Tables']['user_observations']['Insert'];

export type ObservationUpdate = Database['public']['Tables']['user_observations']['Update'];

export type UserObservation = ObservationRow;

export type CreateObservationInput = ObservationInsert;

export type UpdateObservationInput = ObservationUpdate;