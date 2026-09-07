import 'server-only';

import {
  createClient,
} from '@/utils/supabase/server';

import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

interface ProgramContentRow {
  node_key: string;
  program_key: string;
  mission_key: string;
  quest_key: string | null;

  container_type:
    | 'mission'
    | 'quest';

  container_key: string;

  role: ProgramNode['role'];

  component_key: string;

  interaction_type:
    | ProgramNode['interaction']['type']
    | null;

  title: string;

  description: string | null;

  behavioral_intent:
    | string
    | null;

  ai_context_keys: string[];

  dependencies: string[];

  resources: NonNullable<
    ProgramNode['resources']
  >;

  stories: NonNullable<
    ProgramNode['stories']
  >;

  video_url: string | null;

  audio_url: string | null;

  sort_order: number;

  config_version: number;

  metadata: Record<
    string,
    unknown
  >;
}

function rowToNode(
  row: ProgramContentRow,
): ProgramNode {
  return {
    key: row.node_key,

    sequence: row.sort_order,

    container: {
      type: row.container_type,
      key: row.container_key,
    },

    role: row.role,

    component:
      row.component_key,

    title:
      row.title,

    description:
      row.description ??
      undefined,

    behavioralIntent:
      row.behavioral_intent ??
      undefined,

    context:
      row.ai_context_keys,

    dependencies:
      row.dependencies,

    resources:
      row.resources,

    stories:
      row.stories,

    assets: {
      ...(row.video_url
        ? {
            video:
              row.video_url,
          }
        : {}),

      ...(row.audio_url
        ? {
            audio:
              row.audio_url,
          }
        : {}),
    },

    interaction:
      row.interaction_type
        ? {
            type:
              row.interaction_type,
          }
        : undefined,

    metadata:
      row.metadata,
  };
}

/**
 * Fetch all program nodes for a mission.
 */
export async function getProgramNodes(
  missionKey: string,
): Promise<ProgramNode[]> {
  const supabase =
    await createClient();

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
      `Failed to load program nodes: ${error.message}`,
    );
  }

  return (
    (data as ProgramContentRow[] | null)
      ?.map(rowToNode) ??
    []
  );
}

/**
 * Fetch one program node.
 */
export async function getProgramNode(
  nodeKey: string,
): Promise<ProgramNode | null> {
  const supabase =
    await createClient();

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

  return rowToNode(
    data as ProgramContentRow,
  );
}

/**
 * Fetch all nodes belonging to a mission
 * container.
 */
export async function getMissionNodes(
  missionKey: string,
): Promise<ProgramNode[]> {
  const supabase =
    await createClient();

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
    .eq(
      'container_type',
      'mission',
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Failed to load mission nodes: ${error.message}`,
    );
  }

  return (
    (data as ProgramContentRow[] | null)
      ?.map(rowToNode) ??
    []
  );
}

/**
 * Fetch all nodes belonging to a quest.
 */
export async function getQuestNodes(
  missionKey: string,
  questKey: string,
): Promise<ProgramNode[]> {
  const supabase =
    await createClient();

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
    .eq(
      'container_type',
      'quest',
    )
    .eq(
      'container_key',
      questKey,
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Failed to load quest nodes: ${error.message}`,
    );
  }

  return (
    (data as ProgramContentRow[] | null)
      ?.map(rowToNode) ??
    []
  );
}

/**
 * Fetch the complete mission from
 * program_content.
 *
 * The mission remains a runtime object,
 * even though its nodes now come from
 * the database.
 */
export async function getProgramMission(
  missionKey: string,
): Promise<ProgramMission | null> {
  const nodes =
    await getProgramNodes(
      missionKey,
    );

  if (nodes.length === 0) {
    return null;
  }

  return {
    key: missionKey,

    version:
      nodes[0]?.metadata &&
      typeof nodes[0].metadata
        .version === 'number'
        ? nodes[0].metadata
            .version as number
        : 1,

    nodes,
  };
}