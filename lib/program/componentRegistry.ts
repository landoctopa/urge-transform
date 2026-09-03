import type { ComponentType } from 'react';

import { SituationExplorer } from '@/components/program/mission1/SituationExplorer';
import { WhyHaventYouStarted } from '@/components/program/mission1/WhyHaventYouStarted';
import { MotivationExplorer } from '@/components/program/mission1/MotivationExplorer';
import { FutureStateExplorer } from '@/components/program/mission1/FutureStateExplorer';
import { QuitConditionExplorer } from '@/components/program/mission1/QuitConditionExplorer';
import { CommitmentSynthesis } from '@/components/program/mission1/CommitmentSynthesis';
import { MinimumCommitment } from '@/components/program/mission1/MinimumCommitment';

export interface ProgramComponentProps {
  node: import('./types').ProgramNode;

  context: Record<string, unknown>;

  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    payload: Record<string, unknown>;
    aiData?: Record<string, unknown>;
  };

  onComplete: (result?: Record<string, unknown>) => Promise<void>;
}

export type ProgramComponent =
  ComponentType<ProgramComponentProps>;

export const componentRegistry: Record<string, ProgramComponent> = {
  situation_explorer: SituationExplorer,
  why_havent_you_started: WhyHaventYouStarted,
  motivation_explorer: MotivationExplorer,
  future_state_explorer: FutureStateExplorer,
  quit_condition_explorer: QuitConditionExplorer,
  commitment_synthesis: CommitmentSynthesis,
  minimum_commitment: MinimumCommitment,
};

export function getProgramComponent(
  componentKey: string,
): ProgramComponent {
  const component = componentRegistry[componentKey];

  if (!component) {
    throw new Error(
      `Unknown program component: ${componentKey}`,
    );
  }

  return component;
}