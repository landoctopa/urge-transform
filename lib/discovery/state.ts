// lib/discovery/state.ts

import type {
  DiscoveryHurdle,
  DiscoverySituation,
  DiscoveryState,
} from './types';

const STORAGE_KEY = 'urge.discovery.v1';

function now() {
  return new Date().toISOString();
}

export function createDiscoveryState(): DiscoveryState {
  const timestamp = now();

  return {
    version: 1,
    situation: null,
    hurdle: null,
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function setSituation(
  state: DiscoveryState,
  situation: DiscoverySituation,
): DiscoveryState {
  return {
    ...state,
    situation,
    updatedAt: now(),
  };
}

export function setHurdle(
  state: DiscoveryState,
  hurdle: DiscoveryHurdle,
): DiscoveryState {
  return {
    ...state,
    hurdle,
    updatedAt: now(),
  };
}

export function saveDiscoveryState(
  state: DiscoveryState,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Storage is optional.
  }
}

export function loadDiscoveryState(): DiscoveryState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      parsed.version !== 1 ||
      typeof parsed.startedAt !== 'string' ||
      typeof parsed.updatedAt !== 'string'
    ) {
      return null;
    }

    return {
      version: 1,
      situation:
        parsed.situation ?? null,
      hurdle:
        parsed.hurdle ?? null,
      startedAt: parsed.startedAt,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function clearDiscoveryState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );
  } catch {
    // Storage is optional.
  }
}