import type { Json } from '@/types/supabase';

export interface ProgramNodeContext {
  user?: {
    profile?: Json;
    progress?: Json;
    opportunities?: Json;
    projects?: Json;
    contacts?: Json;
    commitments?: Json;
    tasks?: Json;
    observations?: Json;
  };

  program?: {
    missionKey?: string;
    nodeKey?: string;
  };
}