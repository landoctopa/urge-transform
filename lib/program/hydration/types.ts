import type { UserProfile } from '@/lib/program/data/userProfile';
import type { UserNodeProgress } from '@/lib/program/data/userProgress';
import type { UserOpportunity } from '@/lib/program/data/userOpportunities';
import type { UserProject } from '@/lib/program/data/userProjects';
import type { UserContact } from '@/lib/program/data/userContacts';
import type { UserCommitment } from '@/lib/program/data/userCommitments';
import type { UserTask } from '@/lib/program/data/userTasks';
import type { UserObservation } from '@/lib/program/data/userObservations';

export type HydrationDomain =
  | 'profile'
  | 'progress'
  | 'opportunities'
  | 'projects'
  | 'contacts'
  | 'commitments'
  | 'tasks'
  | 'observations';

export interface ProgramHydrationRequest {
  missionKey?: string;
  domains: HydrationDomain[];
}

export interface ProgramHydrationState {
  profile?: UserProfile | null;
  progress?: UserNodeProgress[];
  opportunities?: UserOpportunity[];
  projects?: UserProject[];
  contacts?: UserContact[];
  commitments?: UserCommitment[];
  tasks?: UserTask[];
  observations?: UserObservation[];
}