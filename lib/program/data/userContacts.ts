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

type ContactRow =
  Database['public']['Tables']['user_contacts']['Row'];

type ContactInsert =
  Database['public']['Tables']['user_contacts']['Insert'];

type ContactUpdate =
  Database['public']['Tables']['user_contacts']['Update'];

export interface UserContact {
  id: string;
  userId: string;

  name: string;
  role: string | null;
  organization: string | null;
  relationship: string | null;
  context: string | null;

  contactDetails: Json;

  sourceNodeId: string | null;

  createdAt: string;
  updatedAt: string;
}

function rowToContact(
  row: ContactRow,
): UserContact {
  return {
    id: row.id,
    userId: row.user_id,

    name: row.name,
    role: row.role,
    organization:
      row.organization,
    relationship:
      row.relationship,
    context:
      row.context,

    contactDetails:
      row.contact_details,

    sourceNodeId:
      row.source_node_id,

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

export async function getUserContacts(): Promise<
  UserContact[]
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
    .from('user_contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load contacts: ${error.message}`,
    );
  }

  return (data ?? []).map(
    rowToContact,
  );
}

export async function getContact(
  id: string,
): Promise<UserContact | null> {
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
    .from('user_contacts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load contact: ${error.message}`,
    );
  }

  return data
    ? rowToContact(data)
    : null;
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

export async function createContact(
  input: CreateContactInput,
): Promise<UserContact> {
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

  const row: ContactInsert = {
    user_id: user.id,
    name: input.name,
    role: input.role ?? null,
    organization:
      input.organization ?? null,
    relationship:
      input.relationship ?? null,
    context:
      input.context ?? null,
    contact_details:
      input.contactDetails ?? {},
    source_node_id:
      sourceNodeId,
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
      `Failed to create contact: ${error.message}`,
    );
  }

  return rowToContact(data);
}

export async function updateContact(
  id: string,
  input: ContactUpdate,
): Promise<UserContact> {
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
    .from('user_contacts')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      `Failed to update contact: ${error.message}`,
    );
  }

  return rowToContact(data);
}

export async function deleteContact(
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
    .from('user_contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to delete contact: ${error.message}`,
    );
  }
}