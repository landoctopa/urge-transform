import type {
  DiscoverySituation,
  DiscoveryState,
} from './types';

const STORAGE_KEY = 'urge.discovery.v1';

function createInitialState(): DiscoveryState {
  const now = new Date().toISOString();

  return {
    version: 1,
    stage: 'orientation',
    situation: null,
    motivations: [],
    barriers: [],
    readiness: null,
    responses: {},
    startedAt: now,
    updatedAt: now,
  };
}

export function loadDiscoveryState(): DiscoveryState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createInitialState();
    }

    const parsed = JSON.parse(raw) as DiscoveryState;

    if (parsed.version !== 1) {
      return createInitialState();
    }

    return parsed;
  } catch {
    return createInitialState();
  }
}

export function saveDiscoveryState(
  state: DiscoveryState,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function clearDiscoveryState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function setSituation(
  state: DiscoveryState,
  situation: DiscoverySituation,
): DiscoveryState {
  return {
    ...state,
    situation,
    stage: 'motivation',
    updatedAt: new Date().toISOString(),
  };
}

export function setMotivations(
  state: DiscoveryState,
  motivations: string[],
): DiscoveryState {
  return {
    ...state,
    motivations,
    stage: 'barrier',
    updatedAt: new Date().toISOString(),
  };
}

export function setBarriers(
  state: DiscoveryState,
  barriers: string[],
): DiscoveryState {
  return {
    ...state,
    barriers,
    stage: 'readiness',
    updatedAt: new Date().toISOString(),
  };
}

export function setReadiness(
  state: DiscoveryState,
  readiness: number,
): DiscoveryState {
  return {
    ...state,
    readiness,
    updatedAt: new Date().toISOString(),
  };
}