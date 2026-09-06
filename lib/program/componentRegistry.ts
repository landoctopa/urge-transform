import type { ComponentType } from 'react';
import type { ProgramNode } from './types';

import { SituationExplorer } from '@/components/program/mission1/SituationExplorer';
import { WhyHaventYouStarted } from '@/components/program/mission1/WhyHaventYouStarted';
import { MotivationExplorer } from '@/components/program/mission1/MotivationExplorer';
import { FutureStateExplorer } from '@/components/program/mission1/FutureStateExplorer';
import { QuitConditionExplorer } from '@/components/program/mission1/QuitConditionExplorer';
import { CommitmentSynthesis } from '@/components/program/mission1/CommitmentSynthesis';
import { MinimumCommitment } from '@/components/program/mission1/MinimumCommitment';
import { DeficitExplorer } from '@/components/program/mission1/DeficitExplorer';
import { ResourceInventory } from '@/components/program/mission1/ResourceInventory';
import { NetworkMapper } from '@/components/program/mission1/NetworkMapper';
import { CapabilityInventory } from '@/components/program/mission1/CapabilityInventory';
import { ExperienceMiner } from '@/components/program/mission1/ExperienceMiner';
import { StartingAssetsReveal } from '@/components/program/mission1/StartingAssetsReveal';
import { GapActionPlanner } from '@/components/program/mission1/GapActionPlanner';
import { AskReadiness } from '@/components/program/mission1/AskReadiness';
import { SquadBuilder } from '@/components/program/mission1/SquadBuilder';
import { VisibilityAction } from '@/components/program/mission1/VisibilityAction';
import { RealWorldAsk } from '@/components/program/mission1/RealWorldAsk';
import { AskConfidenceReveal } from '@/components/program/mission1/AskConfidenceReveal';
import { AskerDebrief } from '@/components/program/mission1/AskerDebrief';
import { FearExplorer } from '@/components/program/mission1/FearExplorer';
import { LowThresholdAsk } from '@/components/program/mission1/LowThresholdAsk';
import { FearChallenge } from '@/components/program/mission1/FearChallenge';
import { FearEvidenceReveal } from '@/components/program/mission1/FearEvidenceReveal';
import { FearAudit } from '@/components/program/mission1/FearAudit';
import { MissionTransformation } from '@/components/program/mission1/MIssionTransformation';
import { MissionCommitment } from '@/components/program/mission1/MissionCommitment';

export interface ProgramComponentProps {
  node: ProgramNode;

  context: Record<string, unknown>;

  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    payload: Record<string, unknown>;
    aiData?: Record<string, unknown>;
  };

  onComplete: (
    result?: Record<string, unknown>
  ) => Promise<void>;
}

export type ProgramComponent =
  ComponentType<ProgramComponentProps>;

export const componentRegistry: Record<
  string,
  ProgramComponent
> = {
  situation_explorer: SituationExplorer,
  why_havent_you_started: WhyHaventYouStarted,
  motivation_explorer: MotivationExplorer,
  future_state_explorer: FutureStateExplorer,
  quit_condition_explorer: QuitConditionExplorer,
  commitment_synthesis: CommitmentSynthesis,
  minimum_commitment: MinimumCommitment,
  deficit_explorer: DeficitExplorer,
  resource_inventory: ResourceInventory,
  network_mapper: NetworkMapper,
  capability_inventory: CapabilityInventory,
  experience_miner: ExperienceMiner,
  starting_assets_reveal: StartingAssetsReveal,
  gap_action_planner: GapActionPlanner,
  ask_readiness: AskReadiness,
  squad_builder: SquadBuilder,
  visibility_action: VisibilityAction,
  real_world_ask: RealWorldAsk,
  ask_confidence_reveal: AskConfidenceReveal,
  asker_debrief: AskerDebrief,
  fear_explorer: FearExplorer,
  low_threshold_ask: LowThresholdAsk,
  fear_challenge: FearChallenge,
  fear_evidence_reveal: FearEvidenceReveal,
  fear_audit: FearAudit,
  mission_transformation: MissionTransformation,
  mission_commitment: MissionCommitment
};


export function getProgramComponent(
  componentKey: string
): ProgramComponent {
  const component = componentRegistry[componentKey];

  if (!component) {
    throw new Error(
      `Unknown program component: ${componentKey}`
    );
  }

  return component;
}