// lib/discovery/constants.ts

import type {
  DiscoveryHurdle,
  DiscoveryOption,
  DiscoverySituation,
} from './types';

export const DISCOVERY_SITUATIONS: DiscoveryOption<DiscoverySituation>[] = [
  {
    value: 'idea',
    title: "I've got an idea I've been sitting on.",
    description:
      "It keeps coming back, even if I haven't done much with it yet.",
  },
  {
    value: 'something_of_my_own',
    title: 'I know I want something of my own.',
    description:
      "I just haven't figured out exactly what that looks like.",
  },
  {
    value: 'career_shift',
    title: "I've spent enough time building someone else's thing.",
    description:
      "I'm ready to explore what I could build for myself.",
  },
  {
    value: 'existing_skill',
    title: "I already know how to do something people value.",
    description:
      "I wonder if there is a business somewhere inside it.",
  },
  {
    value: 'previous_attempt',
    title: "I've tried before.",
    description:
      "Something got in the way, and I never really got it moving.",
  },
  {
    value: 'not_sure',
    title: "I'm not even sure what I could build.",
    description:
      "I just know I want to create something of my own.",
  },
];

export const DISCOVERY_HURDLES: DiscoveryOption<DiscoveryHurdle>[] = [
  {
    value: 'dont_know_what',
    title: "I don't know what I could build.",
  },
  {
    value: 'dont_know_where',
    title: "I don't know where to start.",
  },
  {
    value: 'time',
    title: "I don't have much time.",
  },
  {
    value: 'idea_confidence',
    title: "I don't know if my idea is good enough.",
  },
  {
    value: 'knowhow',
    title: "I don't know enough about building a business.",
  },
  {
    value: 'risk',
    title: "I don't want to risk everything.",
  },
  {
    value: 'overthinking',
    title: "I think about it more than I act on it.",
  },
  {
    value: 'lack_of_people',
    title: "I don't have the right people around me.",
  },
];