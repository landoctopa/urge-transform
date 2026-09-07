import 'server-only';

import type {
  Database,
  Json,
} from '@/types/supabase';

import {
  getAuthenticatedSupabase,
  getProgramContentId,
} from './_server';

type ContactRow =
  Database['public']['Tables']['user_contacts']['Row'];

type ContactInsert =
  Database['public']['Tables']['user_contacts']['Insert'];

export interface UserContact {
  id: string;
  userId: string;
  name: string;
  role: string | null;
  organization: string | null;
  relationship: string | null;
  context: string | null;
  contactDetails: Json;
  sourceNodeKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  role?: string | null;
  organization?: string | null;
  relationship?: string | null;
  context?: string | null;
  contactDetails?: Json;
  sourceNodeKey?: string | null;
}

function mapContact(
  row: ContactRow,
  sourceNodeKey: string | null = null,
): UserContact {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    role: row.role,
    organization: row.organization,
    relationship: row.relationship,
    context: row.context,
    contactDetails: row.contact_details,
    sourceNodeKey,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserContacts(): Promise<
  UserContact[]
> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  const {
    data,
    error,
  } = await supabase
    .from('user_contacts')
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
      `Failed to load user contacts: ${error.message}`,
    );
  }

  return (data ?? []).map((row) =>
    mapContact(
      row,
      row.program_content?.node_key ?? null,
    ),
  );
}

export async function createUserContact(
  input: CreateContactInput,
): Promise<UserContact> {
  const { user, supabase } =
    await getAuthenticatedSupabase();

  let sourceNodeId: string | null = null;

  if (input.sourceNodeKey) {
    sourceNodeId =
      await getProgramContentId(
        input.sourceNodeKey,
      );
  }

  const row: ContactInsert = {
    user_id: user.id,
    name: input.name,
    role: input.role ?? null,
    organization: input.organization ?? null,
    relationship:
      input.relationship ?? null,
    context: input.context ?? null,
    contact_details:
      input.contactDetails ?? {},
    source_node_id: sourceNodeId,
  };

  const {
    data,
    error,
  } = await supabase
    .from('user_contacts')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to create user contact: ${error.message}`,
    );
  }

  return mapContact(
    data,
    input.sourceNodeKey ?? null,
  );
}