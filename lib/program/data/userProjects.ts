import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
} from './_server';

type ProjectRow =
  Database['public']['Tables']['user_projects']['Row'];

type ProjectInsert =
  Database['public']['Tables']['user_projects']['Insert'];

export interface UserProject {
  id: string;
  userId: string;
  opportunityId: string | null;
  name: string;
  description: string | null;
  status: string;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  opportunityId?: string | null;
  name: string;
  description?: string | null;
  status?: string;
  metadata?: Json;
}

function mapProject(
  row: ProjectRow,
): UserProject {
  return {
    id: row.id,
    userId: row.user_id,
    opportunityId: row.opportunity_id,
    name: row.name,
    description: row.description,
    status: row.status,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProjects(): Promise<
  UserProject[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load user projects: ${error.message}`,
    );
  }

  return (data ?? []).map(mapProject);
}

export async function createUserProject(
  input: CreateProjectInput,
): Promise<UserProject> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const row: ProjectInsert = {
    user_id: user.id,
    opportunity_id:
      input.opportunityId ?? null,
    name: input.name,
    description:
      input.description ?? null,
    status: input.status ?? 'active',
    metadata: input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_projects')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user project: ${error.message}`,
    );
  }

  return mapProject(data);
}