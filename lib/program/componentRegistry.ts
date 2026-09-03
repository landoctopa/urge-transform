// lib/program/componentRegistry.ts

import * as Mission1 from '@/components/program/mission1';

export const programComponentRegistry = {
  // Mission 1
  situation_explorer: Mission1.SituationExplorer,
  why_havent_you_started: Mission1.WhyHaventYouStarted,
  motivation_explorer: Mission1.MotivationExplorer,
  future_state_explorer: Mission1.FutureStateExplorer,
  quit_condition_explorer: Mission1.QuitConditionExplorer,

  commitment_synthesis: Mission1.CommitmentSynthesis,
  minimum_commitment: Mission1.MinimumCommitment,

  deficit_explorer: Mission1.DeficitExplorer,        // Note: your earlier file had "DeficitExplorer"
  resource_inventory: Mission1.ResourceInventory,
  network_mapper: Mission1.NetworkMapper,
  capability_inventory: Mission1.CapabilityInventory,
  experience_miner: Mission1.ExperienceMiner,
  starting_assets_reveal: Mission1.StartingAssetsReveal,
  gap_action_planner: Mission1.GapActionPlanner,

  ask_readiness: Mission1.AskReadiness,
  squad_builder: Mission1.SquadBuilder,
  visibility_action: Mission1.VisibilityAction,
  real_world_ask: Mission1.RealWorldAsk,
  ask_confidence_reveal: Mission1.AskConfidenceReveal,
  asker_debrief: Mission1.AskerDebrief,

  fear_explorer: Mission1.FearExplorer,
  low_threshold_ask: Mission1.LowThresholdAsk,
  fear_challenge: Mission1.FearChallenge,
  fear_evidence_reveal: Mission1.FearEvidenceReveal,
  fear_audit: Mission1.FearAudit,

  mission_transformation: Mission1.MissionTransformation,
  mission_commitment: Mission1.MissionCommitment,
} as const;