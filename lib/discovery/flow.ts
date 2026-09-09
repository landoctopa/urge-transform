import type {
  DiscoveryStage,
  DiscoverySituation,
} from './types';

export interface DiscoveryOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

export interface DiscoveryStep {
  stage: DiscoveryStage;
  eyebrow: string;
  title: string;
  description?: string;
}

export const discoverySteps: DiscoveryStep[] = [
  {
    stage: 'orientation',
    eyebrow: 'Start here',
    title: "Let's figure out what's pulling you forward.",
    description:
      "You don't need to have the answer yet. We just want to understand where you are and what you want to be different.",
  },
  {
    stage: 'situation',
    eyebrow: 'Where are you?',
    title: 'Which sounds most like where you are right now?',
  },
  {
    stage: 'motivation',
    eyebrow: 'What matters?',
    title: 'What do you want to be different?',
  },
  {
    stage: 'barrier',
    eyebrow: 'What gets in the way?',
    title: 'What is stopping you from moving toward that today?',
  },
  {
    stage: 'readiness',
    eyebrow: 'One last thing',
    title: 'How ready are you to do something about it?',
  },
];

export const situationOptions: DiscoveryOption<DiscoverySituation>[] = [
  {
    value: 'starting',
    label: "I'm starting",
    description:
      "I'm at the beginning of my career and want to figure out what to build toward.",
  },
  {
    value: 'stuck',
    label: "I'm stuck",
    description:
      "I'm doing reasonably well, but I've stopped moving forward.",
  },
  {
    value: 'restless',
    label: "I'm restless",
    description:
      "Something needs to change, but I'm not sure what.",
  },
  {
    value: 'ready',
    label: "I'm ready",
    description:
      "I have something I want to pursue. I just haven't made it real yet.",
  },
  {
    value: 'other',
    label: 'None of these quite fit',
  },
];

export const motivationOptions: DiscoveryOption[] = [
  {
    value: 'growth',
    label: 'I want to grow',
  },
  {
    value: 'meaning',
    label: 'I want more meaning',
  },
  {
    value: 'freedom',
    label: 'I want more freedom',
  },
  {
    value: 'build',
    label: 'I want to build something of my own',
  },
  {
    value: 'strengths',
    label: 'I want to make better use of what I am good at',
  },
  {
    value: 'explore',
    label: 'I want to explore something new',
  },
  {
    value: 'uncertain',
    label: "I'm not really sure yet",
  },
];

export const barrierOptions: DiscoveryOption[] = [
  {
    value: 'choice',
    label: "I don't know what to choose",
  },
  {
    value: 'wrong_choice',
    label: "I'm afraid of making the wrong decision",
  },
  {
    value: 'time',
    label: "I don't have enough time",
  },
  {
    value: 'start',
    label: "I don't know where to start",
  },
  {
    value: 'second_guess',
    label: 'I keep second-guessing myself',
  },
  {
    value: 'people',
    label: "I don't have the right people around me",
  },
  {
    value: 'capability',
    label: "I don't know if I'm capable",
  },
  {
    value: 'possibilities',
    label: 'I have too many possibilities',
  },
  {
    value: 'nothing',
    label: "Nothing is really stopping me — I just haven't started",
  },
];

export const readinessOptions = [
  {
    value: 1,
    label: "I'm just exploring",
  },
  {
    value: 2,
    label: "I'm curious",
  },
  {
    value: 3,
    label: 'I know something needs to change',
  },
  {
    value: 4,
    label: "I'm ready to start",
  },
  {
    value: 5,
    label: "I'm ready to seriously commit",
  },
];