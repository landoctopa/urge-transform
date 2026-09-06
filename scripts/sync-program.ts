import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

import mission1 from '@/lib/program/missions/mission1';
import { componentRegistry } from '@/lib/program/componentRegistry';
import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL',
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY',
  );
}

/*
 * IMPORTANT:
 *
 * This client is only used by the local sync script.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the
 * browser or put it in NEXT_PUBLIC_*.
 */
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

interface ProgramContentRow {
  node_key: string;
  program_key: string;
  mission_key: string;
  quest_key: string | null;

  container_type: 'mission' | 'quest';
  container_key: string;

  role: ProgramNode['role'];
  component_key: string;

  interaction_type: string | null;

  title: string;
  description: string | null;
  behavioral_intent: string | null;

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

  metadata: Record<string, unknown>;
}

interface ValidationResult {
  rows: ProgramContentRow[];
  errors: string[];
  warnings: string[];
}

function validateMission(
  mission: ProgramMission,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rows: ProgramContentRow[] = [];

  const nodeKeys = new Set<string>();

  /*
   * ----------------------------------------------------------
   * 1. Validate node keys and build database rows
   * ----------------------------------------------------------
   */

  for (const node of mission.nodes) {
    if (nodeKeys.has(node.key)) {
      errors.push(
        `Duplicate node key: ${node.key}`,
      );

      continue;
    }

    nodeKeys.add(node.key);

    /*
     * Component registry validation
     */
    if (!componentRegistry[node.component]) {
      errors.push(
        `${node.key}: component "${node.component}" is not registered`,
      );
    }

    /*
     * Container validation
     */
    if (
      node.container.type === 'mission' &&
      node.container.key !== mission.key
    ) {
      errors.push(
        `${node.key}: mission container "${node.container.key}" does not match mission "${mission.key}"`,
      );
    }

    if (
      node.container.type === 'quest' &&
      !node.container.key
    ) {
      errors.push(
        `${node.key}: quest node has no quest container key`,
      );
    }

    /*
     * Quest existence validation
     *
     * We deliberately validate against node.container.key
     * rather than relying on quest arrays being present.
     */
    if (
      node.container.type === 'quest' &&
      mission.nodes.some(
        (candidate) =>
          candidate.container.type === 'quest' &&
          candidate.container.key ===
            node.container.key,
      ) === false
    ) {
      errors.push(
        `${node.key}: invalid quest container "${node.container.key}"`,
      );
    }

    /*
     * Interaction validation
     */
    if (
      node.interaction?.type ===
        'real_world_action' &&
      !node.interaction.requiresReturn
    ) {
      warnings.push(
        `${node.key}: real_world_action does not require a return`,
      );
    }

    /*
     * AI validation
     */
    if (
      node.ai?.enabled &&
      !node.ai.purpose
    ) {
      warnings.push(
        `${node.key}: AI is enabled but has no purpose`,
      );
    }

    const row: ProgramContentRow = {
      node_key: node.key,

      program_key: mission.key,

      mission_key: mission.key,

      quest_key:
        node.container.type === 'quest'
          ? node.container.key
          : null,

      container_type:
        node.container.type,

      container_key:
        node.container.key,

      role: node.role,

      component_key:
        node.component,

      interaction_type:
        node.interaction?.type ??
        null,

      title: node.title,

      description:
        node.description ??
        null,

      behavioral_intent:
        node.behavioralIntent ??
        null,

      ai_context_keys:
        node.context ?? [],

      dependencies:
        node.dependencies ?? [],

      resources:
        node.resources ?? [],

      stories:
        node.stories ?? [],

      video_url:
        node.assets?.video ??
        null,

      audio_url:
        node.assets?.audio ??
        null,

      sort_order:
        node.sequence,

      config_version:
        mission.version,

      metadata:
        node.metadata ?? {},
    };

    rows.push(row);
  }

  /*
   * ----------------------------------------------------------
   * 2. Validate dependencies
   * ----------------------------------------------------------
   */

  for (const node of mission.nodes) {
    for (const dependency of
      node.dependencies ?? []) {
      if (!nodeKeys.has(dependency)) {
        errors.push(
          `${node.key}: dependency "${dependency}" does not exist`,
        );
      }
    }
  }

  /*
   * ----------------------------------------------------------
   * 3. Validate sequence numbers
   * ----------------------------------------------------------
   */

  const sequenceGroups =
    new Map<string, Map<number, string>>();

  for (const node of mission.nodes) {
    const containerKey =
      `${node.container.type}:${node.container.key}`;

    if (
      !sequenceGroups.has(containerKey)
    ) {
      sequenceGroups.set(
        containerKey,
        new Map(),
      );
    }

    const sequences =
      sequenceGroups.get(containerKey)!;

    if (sequences.has(node.sequence)) {
      errors.push(
        `Duplicate sequence ${node.sequence} in ${containerKey}: "${sequences.get(node.sequence)}" and "${node.key}"`,
      );
    }

    sequences.set(
      node.sequence,
      node.key,
    );
  }

  /*
   * ----------------------------------------------------------
   * 4. Validate mission ordering
   * ----------------------------------------------------------
   */

  const orderedNodes = [
    ...mission.nodes,
  ].sort(
    (a, b) =>
      a.sequence - b.sequence,
  );

  for (
    let i = 1;
    i < orderedNodes.length;
    i++
  ) {
    const previous =
      orderedNodes[i - 1];

    const current =
      orderedNodes[i];

    if (
      current.sequence <=
      previous.sequence
    ) {
      errors.push(
        `Invalid mission ordering around "${previous.key}" and "${current.key}"`,
      );
    }
  }

  return {
    rows,
    errors,
    warnings,
  };
}

async function getExistingNodeKeys(
  missionKey: string,
): Promise<string[]> {
  const { data, error } =
    await supabase
      .from('program_content')
      .select('node_key')
      .eq(
        'program_key',
        missionKey,
      );

  if (error) {
    throw new Error(
      `Unable to inspect existing program content: ${error.message}`,
    );
  }

  return (
    data?.map(
      (row) => row.node_key,
    ) ?? []
  );
}

async function syncMission(
  mission: ProgramMission,
) {
  console.log('');
  console.log(
    `Program sync: ${mission.key}`,
  );
  console.log(
    '─'.repeat(60),
  );

  console.log(
    `Found ${mission.nodes.length} nodes`,
  );

  /*
   * ----------------------------------------------------------
   * VALIDATION
   *
   * Nothing is written before this succeeds.
   * ----------------------------------------------------------
   */

  const validation =
    validateMission(mission);

  for (const warning of
    validation.warnings) {
    console.log(`⚠ ${warning}`);
  }

  if (
    validation.errors.length > 0
  ) {
    console.log('');
    console.error(
      'Program sync failed validation:',
    );

    for (const error of
      validation.errors) {
      console.error(
        `✗ ${error}`,
      );
    }

    console.log('');
    console.error(
      'No database changes were made.',
    );

    process.exit(1);
  }

  console.log(
    '✓ node keys valid',
  );

  console.log(
    '✓ components registered',
  );

  console.log(
    '✓ dependencies valid',
  );

  console.log(
    '✓ container relationships valid',
  );

  console.log(
    '✓ sequence ordering valid',
  );

  /*
   * ----------------------------------------------------------
   * Existing database nodes
   * ----------------------------------------------------------
   */

  const existingKeys =
    await getExistingNodeKeys(
      mission.key,
    );

  const configKeys = new Set(
    validation.rows.map(
      (row) => row.node_key,
    ),
  );

  const staleKeys =
    existingKeys.filter(
      (key) =>
        !configKeys.has(key),
    );

  /*
   * We intentionally DO NOT delete stale nodes.
   */
  if (staleKeys.length > 0) {
    console.log('');
    console.log(
      `⚠ ${staleKeys.length} database node(s) are not present in config:`,
    );

    for (const key of
      staleKeys) {
      console.log(
        `  - ${key}`,
      );
    }

    console.log(
      '  No stale rows will be deleted.',
    );
  }

  /*
   * ----------------------------------------------------------
   * UPSERT
   * ----------------------------------------------------------
   */

  console.log('');
  console.log(
    `Syncing ${validation.rows.length} nodes...`,
  );

  const { error } =
    await supabase
      .from('program_content')
      .upsert(
        validation.rows,
        {
          onConflict:
            'node_key',
          ignoreDuplicates:
            false,
        },
      );

  if (error) {
    throw new Error(
      `Program content upsert failed: ${error.message}`,
    );
  }

  /*
   * ----------------------------------------------------------
   * Verify
   * ----------------------------------------------------------
   */

  const syncedKeys =
    await getExistingNodeKeys(
      mission.key,
    );

  const missingAfterSync =
    validation.rows.filter(
      (row) =>
        !syncedKeys.includes(
          row.node_key,
        ),
    );

  if (
    missingAfterSync.length > 0
  ) {
    throw new Error(
      `Sync verification failed. Missing nodes: ${missingAfterSync
        .map((row) => row.node_key)
        .join(', ')}`,
    );
  }

  console.log('');
  console.log(
    `✓ ${validation.rows.length} nodes upserted`,
  );

  console.log(
    `✓ ${validation.rows.length} nodes verified`,
  );

  console.log('');
  console.log(
    `Mission ${mission.key} is synchronized.`,
  );

  console.log(
    '─'.repeat(60),
  );

  console.log('');
}

async function main() {
  try {
    await syncMission(
      mission1,
    );
  } catch (error) {
    console.error('');
    console.error(
      'Program sync failed:',
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exit(1);
  }
}

main();