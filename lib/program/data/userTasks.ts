import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
  getProgramContentId,
} from './_server';

type TaskRow =
  Database['public']['Tables']['user_tasks']['Row'];

type TaskInsert =
  Database['public']['Tables']['user_tasks']['Insert'];

export interface UserTask {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: string;
  taskType: string | null;
  sourceNodeKey: string | null;
  dueAt: string | null;
  completedAt: string | null;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: string;
  taskType?: string | null;
  sourceNodeKey?: string | null;
  dueAt?: string | null;
  metadata?: Json;
}

function mapTask(
  row: TaskRow,
  sourceNodeKey: string | null = null,
): UserTask {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    status: row.status,
    taskType: row.task_type,
    sourceNodeKey,
    dueAt: row.due_at,
    completedAt: row.completed_at,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserTasks(): Promise<
  UserTask[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_tasks')
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
      `Failed to load user tasks: ${error.message}`,
    );
  }

  return (data ?? []).map((row) =>
    mapTask(
      row,
      row.program_content?.node_key ?? null,
    ),
  );
}

export async function createUserTask(
  input: CreateTaskInput,
): Promise<UserTask> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  let sourceNodeId: string | null = null;

  if (input.sourceNodeKey) {
    sourceNodeId =
      await getProgramContentId(
        input.sourceNodeKey,
      );
  }

  const row: TaskInsert = {
    user_id: user.id,
    title: input.title,
    description:
      input.description ?? null,
    status: input.status ?? 'pending',
    task_type:
      input.taskType ?? null,
    source_node_id: sourceNodeId,
    due_at: input.dueAt ?? null,
    completed_at: null,
    metadata: input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_tasks')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user task: ${error.message}`,
    );
  }

  return mapTask(
    data,
    input.sourceNodeKey ?? null,
  );
}