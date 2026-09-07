import 'server-only';

import { cookies } from 'next/headers';

import type { Json } from '@/types/supabase';

import {
    createClient,
} from '@/utils/supabase/server';

import {
    requireCurrentUser,
} from '@/lib/auth';

type UserProfileRow =
    import('@/types/supabase').Database[
    'public'
    ]['Tables']['user_profile']['Row'];

type UserProfileInsert =
    import('@/types/supabase').Database[
    'public'
    ]['Tables']['user_profile']['Insert'];

type UserProfileUpdate =
    import('@/types/supabase').Database[
    'public'
    ]['Tables']['user_profile']['Update'];

/* -------------------------------------------------------------------------- */
/* Domain type                                                                */
/* -------------------------------------------------------------------------- */

export interface UserProfile {
    id: string;
    userId: string;
    capabilities: Json;
    constraints: Json;
    desiredFuture: Json;
    experience: Json;
    fears: Json;
    metadata: Json;
    motivations: Json;
    networkContext: Json;
    perceivedBarriers: Json;
    quitConditions: Json;
    resources: Json;
    createdAt: string;
    updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Row → domain                                                               */
/* -------------------------------------------------------------------------- */

function rowToUserProfile(
    row: UserProfileRow,
): UserProfile {
    return {
        id: row.id,
        userId: row.user_id,
        capabilities: row.capabilities,
        constraints: row.constraints,
        desiredFuture: row.desired_future,
        experience: row.experience,
        fears: row.fears,
        metadata: row.metadata,
        motivations: row.motivations,
        networkContext: row.network_context,
        perceivedBarriers: row.perceived_barriers,
        quitConditions: row.quit_conditions,
        resources: row.resources,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/* -------------------------------------------------------------------------- */
/* Get                                                                       */
/* -------------------------------------------------------------------------- */

export async function getUserProfile(): Promise<
    UserProfile | null
> {
    const user = await requireCurrentUser();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore,);

    const { data, error, } = await supabase
        .from('user_profile')
        .select('*')
        .eq(
            'user_id',
            user.id,
        )
        .maybeSingle();

    if (error) {
        throw new Error(
            `Failed to load user profile: ${error.message}`,
        );
    }

    if (!data) {
        return null;
    }

    return rowToUserProfile(
        data,
    );
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export async function createUserProfile(
    values: Omit<
        UserProfileInsert,
        'user_id'
    >,
): Promise<UserProfile> {

    const user = await requireCurrentUser();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore,);

    const insert: UserProfileInsert = {
        ...values,
        user_id:
            user.id,
    };

    const {
        data,
        error,
    } = await supabase
        .from('user_profile')
        .insert(insert)
        .select('*')
        .single();

    if (error) {
        throw new Error(
            `Failed to create user profile: ${error.message}`,
        );
    }

    return rowToUserProfile(
        data,
    );
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateUserProfile(
    values: UserProfileUpdate,
): Promise<UserProfile> {
    const user = await requireCurrentUser();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore,);

    /*
     * Never allow the caller to change
     * the profile's owning user.
     */
    const update: UserProfileUpdate = {
        ...values,
        user_id:
            user.id,
    };

    const {
        data,
        error,
    } = await supabase
        .from('user_profile')
        .update(update)
        .eq(
            'user_id',
            user.id,
        )
        .select('*')
        .single();

    if (error) {
        throw new Error(
            `Failed to update user profile: ${error.message}`,
        );
    }

    return rowToUserProfile(
        data,
    );
}

/* -------------------------------------------------------------------------- */
/* Upsert                                                                     */
/* -------------------------------------------------------------------------- */

export async function upsertUserProfile(
    values: Omit<
        UserProfileInsert,
        'user_id'
    >,
): Promise<UserProfile> {
    const user = await requireCurrentUser();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore,);
    const insert: UserProfileInsert = {
        ...values,
        user_id:
            user.id,
    };

    const {
        data,
        error,
    } = await supabase
        .from('user_profile')
        .upsert(
            insert,
            {
                onConflict:
                    'user_id',
            },
        )
        .select('*')
        .single();

    if (error) {
        throw new Error(
            `Failed to upsert user profile: ${error.message}`,
        );
    }

    return rowToUserProfile(
        data,
    );
}