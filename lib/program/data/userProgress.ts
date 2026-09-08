// lib/program/data/userProgress.ts
import 'server-only';

import { cookies } from 'next/headers';
import type { Database, Json } from '@/types/supabase';
import { getAuthenticatedSupabase, getProgramContentId } from './_server';
import { requireCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type UserProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export interface UserNodeProgress {
  id: string;
  nodeKey: string;
  programContentId: string;
  status: UserProgressStatus;
  startedAt: string | null;
  completedAt: string | null;
  payload: Json;
  createdAt: string;
  updatedAt: string;
}

type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeStatus(value: string): UserProgressStatus {
  switch (value) {
    case 'not_started':
    case 'in_progress':
    case 'completed':
    case 'skipped':
      return value;

    default:
      throw new Error(
        `Invalid user progress status: "${value}"`,
      );
  }
}


/* -------------------------------------------------------------------------- */
/* Get all progress                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Get the authenticated user's node progress.
 *
 * If missionKey is provided, only progress
 * belonging to that mission is returned.
 */
export async function getUserProgress(missionKey?: string,): Promise<UserNodeProgress[]> {
  const { user, supabase, } = await getAuthenticatedSupabase();

  let query = supabase
    .from('user_progress')
    .select(`
      *,
      program_content!inner (
        node_key,
        mission_key
      )
    `)
    .eq('user_id', user.id,);

  if (missionKey) {
    query = query.eq(
      'program_content.mission_key',
      missionKey,
    );
  }

  const { data, error } = await query.order('created_at', { ascending: true },);

  if (error) {
    throw new Error(
      `Failed to load user progress: ${error.message}`,
    );
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    nodeKey: row.program_content.node_key,
    programContentId: row.program_content_id,
    status: normalizeStatus(row.status),
    startedAt: row.started_at,
    completedAt: row.completed_at,
    payload: row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/* -------------------------------------------------------------------------- */
/* Get progress for one node                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get the authenticated user's progress
 * for one program node.
 */
export async function getNodeProgress(nodeKey: string,): Promise<UserNodeProgress | null> {
  const { user, supabase, } = await getAuthenticatedSupabase();
  const programContentId = await getProgramContentId(nodeKey);

  const { data, error } = await supabase.from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('program_content_id', programContentId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load progress for "${nodeKey}": ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    nodeKey,
    programContentId: data.program_content_id,
    status: normalizeStatus(data.status,),
    startedAt: data.started_at,
    completedAt: data.completed_at,
    payload: data.payload,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Upsert node progress                                                       */
/* -------------------------------------------------------------------------- */

export interface UpsertNodeProgressInput {
  status: UserProgressStatus;
  startedAt?: | string | null;
  completedAt?: | string | null;
  payload?: Json;
}

/**
 * Create or update progress for one node.
 * The database uniqueness constraint: (user_id, program_content_id)
 * makes this operation safely idempotent.
 */
export async function upsertNodeProgress(nodeKey: string, input: UpsertNodeProgressInput,
): Promise<UserNodeProgress> {
  const { user, supabase, } = await getAuthenticatedSupabase();
  const programContentId = await getProgramContentId(nodeKey);

  const row: UserProgressInsert = {
    user_id: user.id,
    program_content_id: programContentId,
    status: input.status,
    started_at: input.startedAt ?? null,
    completed_at: input.completedAt ?? null,
    payload: input.payload ?? {},
  };

  const { data, error, } = await supabase.from('user_progress')
    .upsert(row, { onConflict: 'user_id,program_content_id', },)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to save progress for "${nodeKey}": ${error.message}`,
    );
  }

  return {
    id: data.id,
    nodeKey,
    programContentId: data.program_content_id,
    status: normalizeStatus(data.status,),
    startedAt: data.started_at,
    completedAt: data.completed_at,
    payload: data.payload,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

