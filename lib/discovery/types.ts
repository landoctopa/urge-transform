export type DiscoveryStage =
  | 'orientation'
  | 'situation'
  | 'motivation'
  | 'barrier'
  | 'readiness';

export type DiscoverySituation =
  | 'starting'
  | 'stuck'
  | 'restless'
  | 'ready'
  | 'other';

export interface DiscoveryState {
  version: 1;
  stage: DiscoveryStage;
  situation: DiscoverySituation | null;
  motivations: string[];
  barriers: string[];
  readiness: number | null;
  responses: Record<string, unknown>;
  startedAt: string;
  updatedAt: string;
}