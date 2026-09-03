#!/bin/bash

# create_mission1_components.sh
# Generates one file per Mission 1 component in ./components/program/mission1/

set -e  # exit on error

# Component names (from your registry)
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

# Target directory
TARGET_DIR="./components/program/mission1"

# Create the directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Generate each component file
for component in "${COMPONENTS[@]}"; do
  FILE="${TARGET_DIR}/${component}.tsx"
  cat > "$FILE" <<EOF
import React from 'react';

interface Props {
  title?: string;
}

const ${component}: React.FC<Props> = ({ title }) => (
  <div>{title || '${component}'}</div>
);

export default ${component};
EOF
  echo "Created $FILE"
done

# Generate index.ts
INDEX_FILE="${TARGET_DIR}/index.ts"
cat > "$INDEX_FILE" <<EOF
// Auto‑generated index for Mission 1 components
$(for comp in "${COMPONENTS[@]}"; do echo "export { default as $comp } from './$comp';"; done)
EOF

echo "Created $INDEX_FILE"
echo "Done. All Mission 1 components are scaffolded in $TARGET_DIR"