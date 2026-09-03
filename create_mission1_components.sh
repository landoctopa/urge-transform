#!/bin/bash

set -e

COMPONENTS=(
  "SituationExplorer"
  "WhyHaventYouStarted"
  "MotivationExplorer"
  "FutureStateExplorer"
  "QuitConditionExplorer"
  "CommitmentSynthesis"
  "MinimumCommitment"
  "DeficitExplorer"
  "ResourceInventory"
  "NetworkMapper"
  "CapabilityInventory"
  "ExperienceMiner"
  "StartingAssetsReveal"
  "GapActionPlanner"
  "AskReadiness"
  "SquadBuilder"
  "VisibilityAction"
  "RealWorldAsk"
  "AskConfidenceReveal"
  "AskerDebrief"
  "FearExplorer"
  "LowThresholdAsk"
  "FearChallenge"
  "FearEvidenceReveal"
  "FearAudit"
  "MissionTransformation"
  "MissionCommitment"
)

TARGET_DIR="./components/program/mission1"
mkdir -p "$TARGET_DIR"

for comp in "${COMPONENTS[@]}"; do
  FILE="${TARGET_DIR}/${comp}.tsx"
  cat > "$FILE" <<EOF
import React from 'react';
import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

const ${comp}: React.FC<ProgramComponentProps> = ({
  node,
  context,
  progress,
  onComplete,
  ...rest
}) => {
  const title = node?.title || '${comp}';
  return <div>{title}</div>;
};

export const ${comp};
EOF
  echo "Created $FILE"
done

# Generate index.ts
INDEX_FILE="${TARGET_DIR}/index.ts"
cat > "$INDEX_FILE" <<EOF
// Auto-generated index for Mission 1 components
$(for comp in "${COMPONENTS[@]}"; do echo "export { default as $comp } from './$comp';"; done)
EOF

echo "Created $INDEX_FILE"
echo "Done."