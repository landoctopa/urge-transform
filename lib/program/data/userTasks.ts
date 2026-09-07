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

type TaskRow =
  Database['public']['Tables']['user_tasks']['Row'];

type TaskInsert =
  Database['public']['Tables']['user_tasks']['Insert'];

type TaskUpdate =
  Database['public']['Tables']['user_tasks']['Update'];

export interface UserTask {
  id: string;
  userId: string;

  title: string;
  description: string | null;
  status: string;
  taskType: string | null;

  sourceNodeId: string | null;

  dueAt: string | null;
  completedAt: string | null;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

function rowToTask(
  row: TaskRow,
): UserTask {
  return {
    id: row.id,
    userId: row.user_id,

    title:
      row.title,

    description:
      row.description,

    status:
      row.status,

    taskType:
      row.task_type,

    sourceNodeId:
      row.source_node_id,

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

export async function getUserTasks(): Promise<
  UserTask[]
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
    .from('user_tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load tasks: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToTask,
  );
}

export async function getTask(
  id: string,
): Promise<UserTask | null> {
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
    .from('user_tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load task: ${error.message}`,
    );
  }

  return data
    ? rowToTask(data)
    : null;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: string;
  taskType?: string | null;
  sourceNodeKey?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  metadata?: Json;
}

export async function createTask(
  input: CreateTaskInput,
): Promise<UserTask> {
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

  const row: TaskInsert = {
    user_id:
      user.id,

    title:
      input.title,

    description:
      input.description ?? null,

    status:
      input.status ?? 'pending',

    task_type:
      input.taskType ?? null,

    source_node_id:
      sourceNodeId,

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
    .from('user_tasks')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create task: ${error.message}`,
    );
  }

  return rowToTask(data);
}

export async function updateTask(
  id: string,
  input: TaskUpdate,
): Promise<UserTask> {
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
    .from('user_tasks')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update task: ${error.message}`,
    );
  }

  return rowToTask(data);
}

export async function deleteTask(
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
    .from('user_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete task: ${error.message}`,
    );
  }
}