export type NodeRole =
  | 'question'
  | 'situation'
  | 'complication'
  | 'investigation'
  | 'reveal'
  | 'decision';

export type ContainerType = 'mission' | 'quest';

export type InteractionType =
  | 'conversation'
  | 'structured_form'
  | 'reflection'
  | 'real_world_action'
  | 'ai_personalized'
  | 'ai_personalized_real_world_action';

export interface NodeContainer {
  type: ContainerType;
  key: string;
}

export interface NodeResource {
  key: string;
  type: 'guide' | 'template' | 'tool' | 'worksheet' | 'article';
  required?: boolean;
}

export interface NodeStory {
  key: string;
  type: 'founder_story' | 'contextual' | 'case_study';
  required?: boolean;
}

export interface NodeAssets {
  video?: string | null;
  audio?: string | null;
}

export interface NodeInteraction {
  type: InteractionType;
  requiresReturn?: boolean;
  reflection?: boolean;
}

export interface NodeAI {
  enabled: boolean;
  purpose?: string;
  persistResponse?: boolean;
}

export interface ProgramNode {
  key: string;
  role: NodeRole;
  container: NodeContainer;
  sequence: number;
  component: string;
  title: string;
  description?: string;
  behavioralIntent: string;
  context?: string[];
  dependencies?: string[];
  outputs?: string[];
  interaction?: NodeInteraction;
  ai?: NodeAI;
  resources?: NodeResource[];
  stories?: NodeStory[];
  assets?: NodeAssets;
  metadata?: Record<string, unknown>;
}

export interface ProgramQuest {
  key: string;
  title: string;
  sequence: number;
  description?: string;
  bigQuestion?: string;
}

export interface ProgramMission {
  key: string;
  version: number;

  title: string;
  description: string;

  sequence: number;

  bigQuestion?: string;

  estimatedDays?: number;

  context?: string[];

  assets?: NodeAssets;

  quests?: ProgramQuest[];

  nodes: ProgramNode[];
}