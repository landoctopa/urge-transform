import { mission1 } from './missions/mission1';
// import { mission2 } from './missions/mission2';
// import { mission3 } from './missions/mission3';
// import { mission4 } from './missions/mission4';
// import { mission5 } from './missions/mission5';
// import { mission6 } from './missions/mission6';

import type { ProgramMission } from './types';

export const programMissions: ProgramMission[] = [
  mission1,
  // mission2,
  // mission3,
  // mission4,
  // mission5,
  // mission6,
];

export function getConfiguredMission(
  missionKey: string,
): ProgramMission | null {
  return (
    programMissions.find(
      (mission) =>
        mission.key === missionKey,
    ) ?? null
  );
}