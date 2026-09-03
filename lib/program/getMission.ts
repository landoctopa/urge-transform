import mission1 from './missions/mission1';
import type { ProgramMission } from './types';

const missions: Record<string, ProgramMission> = {
  'mission-1': mission1,
};

export function getMission(
  missionId: string
): ProgramMission | null {
  return missions[missionId] ?? null;
}