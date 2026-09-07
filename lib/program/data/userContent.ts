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

type ContentRow =
  Database['public']['Tables']['user_content']['Row'];

type ContentInsert =
  Database['public']['Tables']['user_content']['Insert'];

type ContentUpdate =
  Database['public']['Tables']['user_content']['Update'];

export interface UserContent {
  id: string;
  userId: string;

  contentType: string;
  title: string | null;
  body: string | null;
  status: string;

  metadata: Json;

  createdAt: string;
  updatedAt: string;
}

function rowToContent(
  row: ContentRow,
): UserContent {
  return {
    id: row.id,
    userId: row.user_id,

    contentType:
      row.content_type,

    title:
      row.title,

    body:
      row.body,

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

export async function getUserContent(): Promise<
  UserContent[]
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
    .from('user_content')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load user content: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToContent,
  );
}

export async function getContent(
  id: string,
): Promise<UserContent | null> {
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
    .from('user_content')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load user content: ${error.message}`,
    );
  }

  return data
    ? rowToContent(data)
    : null;
}

export interface CreateContentInput {
  contentType: string;
  title?: string | null;
  body?: string | null;
  status?: string;
  metadata?: Json;
}

export async function createContent(
  input: CreateContentInput,
): Promise<UserContent> {
  const user =
    await requireCurrentUser();

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);

  const row: ContentInsert = {
    user_id:
      user.id,

    content_type:
      input.contentType,

    title:
      input.title ?? null,

    body:
      input.body ?? null,

    status:
      input.status ?? 'draft',

    metadata:
      input.metadata ?? {},
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_content')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user content: ${error.message}`,
    );
  }

  return rowToContent(data);
}

export async function updateContent(
  id: string,
  input: ContentUpdate,
): Promise<UserContent> {
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
    .from('user_content')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update user content: ${error.message}`,
    );
  }

  return rowToContent(data);
}

export async function deleteContent(
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
    .from('user_content')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete user content: ${error.message}`,
    );
  }
}