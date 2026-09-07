import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
} from './_server';

type ContentRow =
  Database['public']['Tables']['user_content']['Row'];

type ContentInsert =
  Database['public']['Tables']['user_content']['Insert'];

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

export interface CreateUserContentInput {
  contentType: string;
  title?: string | null;
  body?: string | null;
  status?: string;
  metadata?: Json;
}

function mapContent(
  row: ContentRow,
): UserContent {
  return {
    id: row.id,
    userId: row.user_id,
    contentType: row.content_type,
    title: row.title,
    body: row.body,
    status: row.status,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserContent(): Promise<
  UserContent[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_content')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load user content: ${error.message}`,
    );
  }

  return (data ?? []).map(mapContent);
}

export async function createUserContent(
  input: CreateUserContentInput,
): Promise<UserContent> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const row: ContentInsert = {
    user_id: user.id,
    content_type: input.contentType,
    title: input.title ?? null,
    body: input.body ?? null,
    status: input.status ?? 'draft',
    metadata: input.metadata ?? {},
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

  return mapContent(data);
}