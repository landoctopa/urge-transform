// lib/discovery/types.ts

export type DiscoverySituation =
  | 'idea'
  | 'something_of_my_own'
  | 'career_shift'
  | 'existing_skill'
  | 'previous_attempt'
  | 'not_sure';

export type DiscoveryHurdle =
  | 'dont_know_what'
  | 'dont_know_where'
  | 'time'
  | 'idea_confidence'
  | 'knowhow'
  | 'risk'
  | 'overthinking'
  | 'lack_of_people';

export type DiscoveryChoice =
  | 'join'
  | 'try_first';

export type DiscoveryStep =
  | 'situation'
  | 'hurdle'
  | 'reveal';

export interface DiscoveryState {
  version: 1;

  situation: DiscoverySituation | null;
  hurdle: DiscoveryHurdle | null;

  startedAt: string;
  updatedAt: string;
}

export interface DiscoveryOption<T extends string> {
  value: T;
  title: string;
  description?: string;
}

export interface DiscoveryReveal {
  eyebrow: string;
  headline: string;
  subheadline: string;

  recognition: string;

  support: Array<{
    title: string;
    description: string;
  }>;

  ecosystemIntro: string;

  ecosystem: Array<{
    title: string;
    description: string;
  }>;

  closing: string;
}