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

type CommitmentRow =
  Database['public']['Tables']['user_commitments']['Row'];

type CommitmentInsert =
  Database['public']['Tables']['user_commitments']['Insert'];

type CommitmentUpdate =
  Database['public']['Tables']['user_commitments']['Update'];

export interface UserCommitment {
  id: string;
  userId: string;

  commitment: string;
  reason: string | null;
  status: string;

  sourceNodeId: string | null;

  startsAt: string | null;
  dueAt: string | null;
  completedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

function rowToCommitment(
  row: CommitmentRow,
): UserCommitment {
  return {
    id: row.id,
    userId: row.user_id,

    commitment:
      row.commitment,

    reason:
      row.reason,

    status:
      row.status,

    sourceNodeId:
      row.source_node_id,

    startsAt:
      row.starts_at,

    dueAt:
      row.due_at,

    completedAt:
      row.completed_at,

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

export async function getUserCommitments(): Promise<
  UserCommitment[]
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
    .from('user_commitments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load commitments: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToCommitment,
  );
}

export async function getCommitment(
  id: string,
): Promise<UserCommitment | null> {
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
    .from('user_commitments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load commitment: ${error.message}`,
    );
  }

  return data
    ? rowToCommitment(data)
    : null;
}

export interface CreateCommitmentInput {
  commitment: string;
  reason?: string | null;
  status?: string;
  sourceNodeKey?: string | null;
  startsAt?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  metadata?: Json;
}

export async function createCommitment(
  input: CreateCommitmentInput,
): Promise<UserCommitment> {
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

  const row: CommitmentInsert = {
    user_id: user.id,

    commitment:
      input.commitment,

    reason:
      input.reason ?? null,

    status:
      input.status ?? 'active',

    source_node_id:
      sourceNodeId,

    starts_at:
      input.startsAt ?? null,

    due_at:
      input.dueAt ?? null,

    completed_at:
      input.completedAt ?? null,

    metadata:
      input.metadata ?? {},
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
      `Failed to create commitment: ${error.message}`,
    );
  }

  return rowToCommitment(data);
}

export async function updateCommitment(
  id: string,
  input: CommitmentUpdate,
): Promise<UserCommitment> {
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
    .from('user_commitments')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update commitment: ${error.message}`,
    );
  }

  return rowToCommitment(data);
}

export async function deleteCommitment(
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
    .from('user_commitments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete commitment: ${error.message}`,
    );
  }
}