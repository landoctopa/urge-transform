import 'server-only';

import { cookies } from 'next/headers';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  requireCurrentUser,
} from '@/lib/auth';

import {
  createClient,
} from '@/utils/supabase/server';

type ObservationRow =
  Database['public']['Tables']['user_observations']['Row'];

type ObservationInsert =
  Database['public']['Tables']['user_observations']['Insert'];

type ObservationUpdate =
  Database['public']['Tables']['user_observations']['Update'];

export interface UserObservation {
  id: string;
  userId: string;

  type: string | null;
  title: string | null;
  content: Json;

  sourceNodeId: string | null;
  observedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

function rowToObservation(
  row: ObservationRow,
): UserObservation {
  return {
    id: row.id,
    userId: row.user_id,

    type: row.type,
    title: row.title,
    content: row.content,

    sourceNodeId:
      row.source_node_id,

    observedAt:
      row.observed_at,

    metadata:
      row.metadata,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

async function resolveNodeId(
  nodeKey: string | null | undefined,
): Promise<string | null> {
  if (!nodeKey) {
    return null;
  }

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('program_content')
    .select('id')
    .eq('node_key', nodeKey)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to resolve program node "${nodeKey}": ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      `Program node "${nodeKey}" does not exist`,
    );
  }

  return data.id;
}

export async function getUserObservations(): Promise<
  UserObservation[]
> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_observations')
    .select('*')
    .eq('user_id', user.id)
    .order('observed_at', {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    throw new Error(
      `Failed to load user observations: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToObservation,
  );
}

export async function getObservation(
  id: string,
): Promise<UserObservation | null> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_observations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load observation: ${error.message}`,
    );
  }

  return data
    ? rowToObservation(data)
    : null;
}

export interface CreateObservationInput {
  type?: string | null;
  title?: string | null;
  content?: Json;
  sourceNodeKey?: string | null;
  observedAt?: string | null;
  metadata?: Json;
}

export async function createObservation(
  input: CreateObservationInput,
): Promise<UserObservation> {
  const user =
    await requireCurrentUser();

  const sourceNodeId =
    await resolveNodeId(
      input.sourceNodeKey,
    );

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const row: ObservationInsert = {
    user_id: user.id,
    type: input.type ?? null,
    title: input.title ?? null,
    content: input.content ?? {},
    source_node_id: sourceNodeId,
    observed_at:
      input.observedAt ?? null,
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
      `Failed to create observation: ${error.message}`,
    );
  }

  return rowToObservation(data);
}

export async function updateObservation(
  id: string,
  input: ObservationUpdate,
): Promise<UserObservation> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    data,
    error,
  } = await supabase
    .from('user_observations')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update observation: ${error.message}`,
    );
  }

  return rowToObservation(data);
}

export async function deleteObservation(
  id: string,
): Promise<void> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const {
    error,
  } = await supabase
    .from('user_observations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete observation: ${error.message}`,
    );
  }
}