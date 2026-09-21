import 'server-only';

import type {
  Database,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
  getProgramContentId,
} from './_server';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type OpportunityRow =
  Database['public']['Tables']['user_opportunities']['Row'];

type OpportunityInsert =
  Database['public']['Tables']['user_opportunities']['Insert'];

export type UserOpportunityStatus =
  | 'exploring'
  | 'active'
  | 'archived';

export interface UserOpportunity {
  id: OpportunityRow['id'];
  userId: OpportunityRow['user_id'];

  title: OpportunityRow['title'];
  description: OpportunityRow['description'];
  status: OpportunityRow['status'];
  source: OpportunityRow['source'];
  sourceNodeKey: string | null;

  problem: OpportunityRow['problem'];
  customer: OpportunityRow['customer'];
  hypothesis: OpportunityRow['hypothesis'];

  observationIds: OpportunityRow['observation_ids'];

  metadata: OpportunityRow['metadata'];

  createdAt: OpportunityRow['created_at'];
  updatedAt: OpportunityRow['updated_at'];
}

export interface CreateOpportunityInput {
  title?: OpportunityInsert['title'];
  description?: OpportunityInsert['description'];
  status?: OpportunityInsert['status'];
  source?: OpportunityInsert['source'];
  sourceNodeKey?: string | null;

  problem?: OpportunityInsert['problem'];
  customer?: OpportunityInsert['customer'];
  hypothesis?: OpportunityInsert['hypothesis'];

  observationIds?: OpportunityInsert['observation_ids'];

  metadata?: OpportunityInsert['metadata'];
}

/* -------------------------------------------------------------------------- */
/* Mapping                                                                    */
/* -------------------------------------------------------------------------- */

function mapOpportunity(
  row: OpportunityRow,
  sourceNodeKey: string | null = null,
): UserOpportunity {
  return {
    id: row.id,
    userId: row.user_id,

    title: row.title,
    description: row.description,
    status: row.status,
    source: row.source,
    sourceNodeKey,

    problem: row.problem,
    customer: row.customer,
    hypothesis: row.hypothesis,

    observationIds: row.observation_ids,

    metadata: row.metadata,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Get opportunities                                                          */
/* -------------------------------------------------------------------------- */

export async function getUserOpportunities(): Promise<
  UserOpportunity[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_opportunities')
    .select(`
      *,
      program_content (
        node_key
      )
    `)
    .eq('user_id', user.auth.id)
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load user opportunities: ${error.message}`,
    );
  }

  return (data ?? []).map((row) =>
    mapOpportunity(
      row,
      row.program_content?.node_key ?? null,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Create opportunity                                                         */
/* -------------------------------------------------------------------------- */

export async function createUserOpportunity(
  input: CreateOpportunityInput,
): Promise<UserOpportunity> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  let sourceNodeId: string | null = null;

  if (input.sourceNodeKey) {
    sourceNodeId =
      await getProgramContentId(
        input.sourceNodeKey,
      );
  }

  const row: OpportunityInsert = {
    user_id: user.auth.id,

    title: input.title ?? null,
    description: input.description ?? null,
    status: input.status ?? 'exploring',
    source: input.source ?? null,
    source_node_id: sourceNodeId,

    problem: input.problem ?? null,
    customer: input.customer ?? null,
    hypothesis: input.hypothesis ?? null,

    observation_ids:
      input.observationIds ?? [],

    metadata: input.metadata ?? {},
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
      `Failed to create user opportunity: ${error.message}`,
    );
  }

  return mapOpportunity(
    data,
    input.sourceNodeKey ?? null,
  );
}