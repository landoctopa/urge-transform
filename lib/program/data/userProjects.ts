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

type ProjectRow =
  Database['public']['Tables']['user_projects']['Row'];

type ProjectInsert =
  Database['public']['Tables']['user_projects']['Insert'];

type ProjectUpdate =
  Database['public']['Tables']['user_projects']['Update'];

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

function rowToProject(
  row: ProjectRow,
): UserProject {
  return {
    id: row.id,
    userId: row.user_id,

    opportunityId:
      row.opportunity_id,

    name:
      row.name,

    description:
      row.description,

    status:
      row.status,

    metadata:
      row.metadata,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

export async function getUserProjects(): Promise<
  UserProject[]
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
    .from('user_projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load projects: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToProject,
  );
}

export async function getProject(
  id: string,
): Promise<UserProject | null> {
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
    .from('user_projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load project: ${error.message}`,
    );
  }

  return data
    ? rowToProject(data)
    : null;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  status?: string;
  opportunityId?: string | null;
  metadata?: Json;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<UserProject> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const row: ProjectInsert = {
    user_id:
      user.id,

    opportunity_id:
      input.opportunityId ?? null,

    name:
      input.name,

    description:
      input.description ?? null,

    status:
      input.status ?? 'active',

    metadata:
      input.metadata ?? {},
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
      `Failed to create project: ${error.message}`,
    );
  }

  return rowToProject(data);
}

export async function updateProject(
  id: string,
  input: ProjectUpdate,
): Promise<UserProject> {
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
    .from('user_projects')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update project: ${error.message}`,
    );
  }

  return rowToProject(data);
}

export async function deleteProject(
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
    .from('user_projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete project: ${error.message}`,
    );
  }
}