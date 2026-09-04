import type { ProgramProgress } from './progress';

const STORAGE_PREFIX = 'program-progress:';

function getStorageKey(missionKey: string) {
  return `${STORAGE_PREFIX}${missionKey}`;
}

export function loadProgress(
  missionKey: string,
): ProgramProgress | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(
    getStorageKey(missionKey),
  );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ProgramProgress;
  } catch {
    return null;
  }
}

export function saveProgress(
  progress: ProgramProgress,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const nextProgress: ProgramProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    getStorageKey(progress.missionKey),
    JSON.stringify(nextProgress),
  );
}

export function clearProgress(
  missionKey: string,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(
    getStorageKey(missionKey),
  );
}