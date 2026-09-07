import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
  getProgramContentId,
} from './_server';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ObservationRow =
  Database['public']['Tables']['user_observations']['Row'];

type ObservationInsert =
  Database['public']['Tables']['user_observations']['Insert'];

export interface UserObservation {
  id: string;
  userId: string;
  type: string | null;
  title: string | null;
  content: Json;
  sourceNodeKey: string | null;
  observedAt: string | null;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
}

export interface CreateObservationInput {
  type?: string | null;
  title?: string | null;
  content?: Json;
  sourceNodeKey?: string | null;
  observedAt?: string | null;
  metadata?: Json;
}

/* -------------------------------------------------------------------------- */
/* Mapping                                                                    */
/* -------------------------------------------------------------------------- */

function mapObservation(
  row: ObservationRow,
  sourceNodeKey: string | null = null,
): UserObservation {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    content: row.content,
    sourceNodeKey,
    observedAt: row.observed_at,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Get observations                                                           */
/* -------------------------------------------------------------------------- */

export async function getUserObservations(): Promise<
  UserObservation[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_observations')
    .select(`
      *,
      program_content (
        node_key
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load user observations: ${error.message}`,
    );
  }

  return (data ?? []).map((row) =>
    mapObservation(
      row,
      row.program_content?.node_key ?? null,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Create observation                                                         */
/* -------------------------------------------------------------------------- */

export async function createUserObservation(
  input: CreateObservationInput,
): Promise<UserObservation> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  let sourceNodeId: string | null = null;

  if (input.sourceNodeKey) {
    sourceNodeId =
      await getProgramContentId(
        input.sourceNodeKey,
      );
  }

  const row: ObservationInsert = {
    user_id: user.id,
    type: input.type ?? null,
    title: input.title ?? null,
    content: input.content ?? {},
    source_node_id: sourceNodeId,
    observed_at: input.observedAt ?? null,
    metadata: input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_observations')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user observation: ${error.message}`,
    );
  }

  return mapObservation(
    data,
    input.sourceNodeKey ?? null,
  );
}