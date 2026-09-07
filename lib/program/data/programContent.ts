import 'server-only';

import { cookies } from 'next/headers';

import type {
  Database,
  Json,
} from '@/types/supabase';

import type {
  ContainerType,
  InteractionType,
  NodeAI,
  NodeResource,
  NodeRole,
  NodeStory,
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import {
  getConfiguredMission,
} from '@/lib/program/missions';

import {
  createClient,
} from '@/utils/supabase/server';

type ProgramContentRow =
  Database[
    'public'
  ]['Tables'][
    'program_content'
  ]['Row'];

/* -------------------------------------------------------------------------- */
/* Type guards                                                                */
/* -------------------------------------------------------------------------- */

function isContainerType(
  value: string,
): value is ContainerType {
  return (
    value === 'mission' ||
    value === 'quest'
  );
}

function isNodeRole(
  value: string,
): value is NodeRole {
  return (
    value === 'question' ||
    value === 'situation' ||
    value === 'complication' ||
    value === 'investigation' ||
    value === 'reveal' ||
    value === 'decision'
  );
}

function isInteractionType(
  value: string,
): value is InteractionType {
  return (
    value === 'conversation' ||
    value === 'structured_form' ||
    value === 'reflection' ||
    value === 'real_world_action' ||
    value === 'ai_personalized' ||
    value ===
      'ai_personalized_real_world_action'
  );
}

function isRecord(
  value: Json | undefined,
): value is Record<
  string,
  Json | undefined
> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function asJsonArray(
  value: Json | undefined,
): Json[] {
  return Array.isArray(value)
    ? value
    : [];
}

function asStringArray(
  value: Json | undefined,
): string[] {
  return asJsonArray(value).filter(
    (
      item,
    ): item is string =>
      typeof item === 'string',
  );
}

/* -------------------------------------------------------------------------- */
/* Resources                                                                  */
/* -------------------------------------------------------------------------- */

function parseResources(
  value: Json | undefined,
): NodeResource[] {
  return asJsonArray(value)
    .filter(isRecord)
    .filter(
      (item) =>
        typeof item.key ===
          'string' &&
        typeof item.type ===
          'string',
    )
    .filter(
      (item) =>
        item.type === 'guide' ||
        item.type === 'template' ||
        item.type === 'tool' ||
        item.type === 'worksheet' ||
        item.type === 'article',
    )
    .map((item) => ({
      key:
        item.key as string,

      type:
        item.type as NodeResource['type'],

      ...(typeof item.required ===
      'boolean'
        ? {
            required:
              item.required,
          }
        : {}),
    }));
}

/* -------------------------------------------------------------------------- */
/* Stories                                                                    */
/* -------------------------------------------------------------------------- */

function parseStories(
  value: Json | undefined,
): NodeStory[] {
  return asJsonArray(value)
    .filter(isRecord)
    .filter(
      (item) =>
        typeof item.key ===
          'string' &&
        typeof item.type ===
          'string',
    )
    .filter(
      (item) =>
        item.type ===
          'founder_story' ||
        item.type ===
          'contextual' ||
        item.type ===
          'case_study',
    )
    .map((item) => ({
      key:
        item.key as string,

      type:
        item.type as NodeStory['type'],

      ...(typeof item.required ===
      'boolean'
        ? {
            required:
              item.required,
          }
        : {}),
    }));
}

/* -------------------------------------------------------------------------- */
/* AI configuration                                                            */
/* -------------------------------------------------------------------------- */

function parseAI(
  metadata: Json | undefined,
): NodeAI | undefined {
  if (!isRecord(metadata)) {
    return undefined;
  }

  /*
   * Because Json object properties are
   * Json | undefined, we explicitly guard
   * metadata.ai before passing it to
   * isRecord().
   */
  const ai =
    metadata.ai;

  if (!isRecord(ai)) {
    return undefined;
  }

  if (
    typeof ai.enabled !==
    'boolean'
  ) {
    return undefined;
  }

  return {
    enabled:
      ai.enabled,

    ...(typeof ai.purpose ===
    'string'
      ? {
          purpose:
            ai.purpose,
        }
      : {}),

    ...(typeof ai.persistResponse ===
    'boolean'
      ? {
          persistResponse:
            ai.persistResponse,
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* Database row → ProgramNode                                                  */
/* -------------------------------------------------------------------------- */

function rowToNode(
  row: ProgramContentRow,
): ProgramNode {
  if (
    !isContainerType(
      row.container_type,
    )
  ) {
    throw new Error(
      `Invalid container_type "${row.container_type}" on node "${row.node_key}"`,
    );
  }

  if (
    !isNodeRole(row.role)
  ) {
    throw new Error(
      `Invalid role "${row.role}" on node "${row.node_key}"`,
    );
  }

  if (!row.title) {
    throw new Error(
      `Node "${row.node_key}" is missing a title`,
    );
  }

  if (!row.behavioral_intent) {
    throw new Error(
      `Node "${row.node_key}" is missing behavioral_intent`,
    );
  }

  const node: ProgramNode = {
    key:
      row.node_key,

    role:
      row.role,

    container: {
      type:
        row.container_type,

      key:
        row.container_key,
    },

    sequence:
      row.sort_order,

    /*
     * IMPORTANT:
     *
     * Database:
     *   component_key
     *
     * Application:
     *   component
     */
    component:
      row.component_key,

    title:
      row.title,

    description:
      row.description ??
      undefined,

    behavioralIntent:
      row.behavioral_intent,

    context:
      asStringArray(
        row.ai_context_keys,
      ),

    dependencies:
      asStringArray(
        row.dependencies,
      ),

    resources:
      parseResources(
        row.resources,
      ),

    stories:
      parseStories(
        row.stories,
      ),

    assets: {
      video:
        row.video_url,

      audio:
        row.audio_url,
    },

    metadata:
      isRecord(row.metadata)
        ? Object.fromEntries(
            Object.entries(
              row.metadata,
            ).filter(
              (
                entry,
              ): entry is [
                string,
                Json,
              ] =>
                entry[1] !==
                undefined,
            ),
          )
        : {},
  };

  /* ---------------------------------------------------------------------- */
  /* Interaction                                                            */
  /* ---------------------------------------------------------------------- */

  if (
    row.interaction_type !==
    null
  ) {
    if (
      !isInteractionType(
        row.interaction_type,
      )
    ) {
      throw new Error(
        `Invalid interaction_type "${row.interaction_type}" on node "${row.node_key}"`,
      );
    }

    node.interaction = {
      type:
        row.interaction_type,
    };
  }

  /* ---------------------------------------------------------------------- */
  /* AI                                                                     */
  /* ---------------------------------------------------------------------- */

  const ai =
    parseAI(
      row.metadata,
    );

  if (ai) {
    node.ai = ai;
  }

  return node;
}

/* -------------------------------------------------------------------------- */
/* Repository                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Load all persisted nodes for a mission.
 */
export async function getProgramNodes(
  missionKey: string,
): Promise<ProgramNode[]> {
  const cookieStore =
    await cookies();

  const supabase =
    createClient(
      cookieStore,
    );

  const {
    data,
    error,
  } = await supabase
    .from('program_content')
    .select('*')
    .eq(
      'mission_key',
      missionKey,
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Failed to load program content for "${missionKey}": ${error.message}`,
    );
  }

  return (
    data ?? []
  ).map(rowToNode);
}

/**
 * Load one persisted node.
 */
export async function getProgramNode(
  nodeKey: string,
): Promise<ProgramNode | null> {
  const cookieStore =
    await cookies();

  const supabase =
    createClient(
      cookieStore,
    );

  const {
    data,
    error,
  } = await supabase
    .from('program_content')
    .select('*')
    .eq(
      'node_key',
      nodeKey,
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load program node "${nodeKey}": ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return rowToNode(data);
}

/**
 * Load a complete runtime mission.
 *
 * Mission metadata comes from the
 * TypeScript mission registry.
 *
 * Node content comes from Supabase.
 */
export async function getProgramMission(
  missionKey: string,
): Promise<ProgramMission | null> {
  const configuredMission =
    getConfiguredMission(
      missionKey,
    );

  if (!configuredMission) {
    return null;
  }

  const nodes =
    await getProgramNodes(
      missionKey,
    );

  if (nodes.length === 0) {
    return null;
  }

  return {
    ...configuredMission,

    nodes,
  };
}