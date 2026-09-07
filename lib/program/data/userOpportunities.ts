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

type OpportunityRow =
  Database['public']['Tables']['user_opportunities']['Row'];

type OpportunityInsert =
  Database['public']['Tables']['user_opportunities']['Insert'];

type OpportunityUpdate =
  Database['public']['Tables']['user_opportunities']['Update'];

export interface UserOpportunity {
  id: string;
  userId: string;

  title: string | null;
  description: string | null;
  status: string;
  source: string | null;

  sourceNodeId: string | null;

  problem: string | null;
  customer: string | null;
  hypothesis: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

function rowToOpportunity(
  row: OpportunityRow,
): UserOpportunity {
  return {
    id: row.id,
    userId: row.user_id,

    title: row.title,
    description: row.description,
    status: row.status,
    source: row.source,

    sourceNodeId:
      row.source_node_id,

    problem: row.problem,
    customer: row.customer,
    hypothesis: row.hypothesis,

    metadata: row.metadata,

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

export async function getUserOpportunities(): Promise<
  UserOpportunity[]
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
    .from('user_opportunities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load opportunities: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToOpportunity,
  );
}

export async function getOpportunity(
  id: string,
): Promise<UserOpportunity | null> {
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
    .from('user_opportunities')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load opportunity: ${error.message}`,
    );
  }

  return data
    ? rowToOpportunity(data)
    : null;
}

export interface CreateOpportunityInput {
  title?: string | null;
  description?: string | null;
  status?: string;
  source?: string | null;
  sourceNodeKey?: string | null;
  problem?: string | null;
  customer?: string | null;
  hypothesis?: string | null;
  metadata?: Json;
}

export async function createOpportunity(
  input: CreateOpportunityInput,
): Promise<UserOpportunity> {
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

  const row: OpportunityInsert = {
    user_id: user.id,
    title: input.title ?? null,
    description:
      input.description ?? null,
    status:
      input.status ?? 'exploring',
    source:
      input.source ?? null,
    source_node_id:
      sourceNodeId,
    problem:
      input.problem ?? null,
    customer:
      input.customer ?? null,
    hypothesis:
      input.hypothesis ?? null,
    metadata:
      input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_opportunities')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create opportunity: ${error.message}`,
    );
  }

  return rowToOpportunity(data);
}

export async function updateOpportunity(
  id: string,
  input: OpportunityUpdate,
): Promise<UserOpportunity> {
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
    .from('user_opportunities')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update opportunity: ${error.message}`,
    );
  }

  return rowToOpportunity(data);
}

export async function deleteOpportunity(
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
    .from('user_opportunities')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete opportunity: ${error.message}`,
    );
  }
}