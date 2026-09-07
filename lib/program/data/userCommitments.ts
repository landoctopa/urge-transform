import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
  getProgramContentId,
} from './_server';

type CommitmentRow =
  Database['public']['Tables']['user_commitments']['Row'];

type CommitmentInsert =
  Database['public']['Tables']['user_commitments']['Insert'];

export interface UserCommitment {
  id: string;
  userId: string;
  commitment: string;
  reason: string | null;
  status: string;
  sourceNodeKey: string | null;
  startsAt: string | null;
  dueAt: string | null;
  completedAt: string | null;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommitmentInput {
  commitment: string;
  reason?: string | null;
  status?: string;
  sourceNodeKey?: string | null;
  startsAt?: string | null;
  dueAt?: string | null;
  metadata?: Json;
}

function mapCommitment(
  row: CommitmentRow,
  sourceNodeKey: string | null = null,
): UserCommitment {
  return {
    id: row.id,
    userId: row.user_id,
    commitment: row.commitment,
    reason: row.reason,
    status: row.status,
    sourceNodeKey,
    startsAt: row.starts_at,
    dueAt: row.due_at,
    completedAt: row.completed_at,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserCommitments(): Promise<
  UserCommitment[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_commitments')
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
      `Failed to load user commitments: ${error.message}`,
    );
  }

  return (data ?? []).map((row) =>
    mapCommitment(
      row,
      row.program_content?.node_key ?? null,
    ),
  );
}

export async function createUserCommitment(
  input: CreateCommitmentInput,
): Promise<UserCommitment> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  let sourceNodeId: string | null = null;

  if (input.sourceNodeKey) {
    sourceNodeId =
      await getProgramContentId(
        input.sourceNodeKey,
      );
  }

  const row: CommitmentInsert = {
    user_id: user.id,
    commitment: input.commitment,
    reason: input.reason ?? null,
    status: input.status ?? 'active',
    source_node_id: sourceNodeId,
    starts_at: input.startsAt ?? null,
    due_at: input.dueAt ?? null,
    completed_at: null,
    metadata: input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_commitments')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user commitment: ${error.message}`,
    );
  }

  return mapCommitment(
    data,
    input.sourceNodeKey ?? null,
  );
}