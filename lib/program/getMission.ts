import {mission1} from './missions/mission1';
import {mission2} from './missions/mission2';
import type { ProgramMission } from './types';

const missions: Record<string, ProgramMission> = {
  'mission-1': mission1,
  'mission-2': mission2,
};

export function getMission(
  missionId: string
): ProgramMission | null {
  return missions[missionId] ?? null;
}