// types.ts

// ------------------------------------------------------------------
// Core Mission Type
// ------------------------------------------------------------------

export interface ProgramMission {
  key: string;
  version: number;
  title: string;
  sequence: number;
  bigQuestion: string;
  description: string;
  estimatedDays: number;
  assets: {
    video: string | null;   // URL
    audio: string | null;   // URL
  };
  context: string[];        // e.g., 'user.profile', 'user.opportunities', ...
  nodes: ProgramNode[];
}

// ------------------------------------------------------------------
// Node Types
// ------------------------------------------------------------------

export type NodeRole = 'situation' | 'complication' | 'investigation' | 'reveal' | 'decision';

export interface Container {
  type: 'mission' | 'quest';
  key: string;
}

export interface NodeMetadata {
  canCreateOpportunity?: boolean;
  allowMultipleOpportunities?: boolean;
  nextMission?: string;              // only on mission-level decision nodes
  readinessReassessment?: boolean;
  accountabilityCheck?: boolean;
}

export interface AI {
  enabled: boolean;
  purpose: string;                   // e.g., 'synthesize', 'compare_perceived_and_actual_assets', ...
  persistResponse: boolean;
}

export type InteractionType =
  | 'conversation'
  | 'structured_form'
  | 'reflection'
  | 'real_world_action'
  | 'ai_personalized'
  | 'ai_personalized_real_world_action';

export interface Interaction {
  type: InteractionType;
  requiresReturn: boolean;
  reflection: boolean;
}

export interface ProgramNode {
  key: string;
  role: NodeRole;
  container: Container;
  sequence: number;
  component: string;                 // e.g., 'situation_explorer', 'why_havent_you_started', ...
  title: string;
  behavioralIntent: string;
  context: string[];                // list of context keys needed
  dependencies: string[];           // node keys that must be completed before this one
  outputs: string[];                // output keys (e.g., 'user_profile.mission_starting_point')
  metadata?: NodeMetadata;
  resources: Resource[];            // can be empty array
  stories: Story[];                 // can be empty array
  ai?: AI;                          // usually present on reveal nodes
  interaction?: Interaction;        // present on real-world action nodes
}

// ------------------------------------------------------------------
// Resource Type
// ------------------------------------------------------------------

export interface Resource {
  key: string;
  type: 'guide' | 'template' | 'tool';   // extend if needed
  required: boolean;
  title?: string;   // may be provided, but not always
  url?: string;     // may be provided, but not always
}

// ------------------------------------------------------------------
// Story Type
// ------------------------------------------------------------------

export interface Story {
  key: string;
  type: 'contextual' | 'founder_story' | string;   // allow other strings
  required: boolean;
  title?: string;        // optional
  description?: string;  // optional
  content_id?: string;   // optional
  relevance?: string;    // optional
}