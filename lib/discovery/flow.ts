import type {
  DiscoveryStage,
  DiscoverySituation,
} from './types';

export interface DiscoveryOption<
  T = string,
> {
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

    eyebrow: 'A different way forward',

    title:
      'What if the next chapter of your career is closer than you think?',

    description:
      'You do not need a five-year plan. You need a clearer sense of what is possible — and a way to start moving toward it.',
  },

  {
    stage: 'situation',

    eyebrow: 'Start where you are',

    title:
      'Which sounds most like you right now?',
  },

  {
    stage: 'future',

    eyebrow: 'Picture this',

    title:
      'Imagine six months from now, and something has genuinely changed.',

    description:
      'Not a fantasy. Something real enough that you would notice it in the way you spend your time, the work you do, or the opportunities you pursue.',
  },

  {
    stage: 'motivation',

    eyebrow: 'What is pulling you forward?',

    title:
      'What would make the effort worth it?',
  },

  {
    stage: 'tension',

    eyebrow: 'Here is the tension',

    title:
      'You probably already know something needs to change.',

    description:
      'The difficult part is turning that feeling into a direction — and then turning direction into movement.',
  },

  {
    stage: 'barrier',

    eyebrow: 'What gets in the way?',

    title:
      'What usually keeps you from making the move?',
  },

  {
    stage: 'urge',

    eyebrow: 'This is where Urge comes in',

    title:
      'You do not have to figure this out alone.',

    description:
      'Urge gives you a structured path, people who are moving alongside you, live sessions, a community, and access to people who can help you make better decisions and keep moving.',
  },

  {
    stage: 'readiness',

    eyebrow: 'Your move',

    title:
      'How ready are you to do something about it?',
  },

  {
    stage: 'commitment',

    eyebrow: 'One last question',

    title:
      'What would it mean to actually give this a shot?',
  },
];

export const situationOptions: DiscoveryOption<DiscoverySituation>[] =
  [
    {
      value: 'starting',

      label:
        "I'm starting",

      description:
        "I'm at the beginning of my career and want to figure out what to build toward.",
    },

    {
      value: 'stuck',

      label:
        "I'm stuck",

      description:
        "I'm doing reasonably well, but I've stopped moving forward.",
    },

    {
      value: 'restless',

      label:
        "I'm restless",

      description:
        "Something needs to change, but I'm not sure what.",
    },

    {
      value: 'ready',

      label:
        "I'm ready",

      description:
        "I have something I want to pursue. I just haven't made it real yet.",
    },

    {
      value: 'other',

      label:
        'None of these quite fit',
    },
  ];

export const motivationOptions: DiscoveryOption[] =
  [
    {
      value: 'growth',
      label:
        'I want to grow',
    },

    {
      value: 'meaning',
      label:
        'I want more meaning',
    },

    {
      value: 'freedom',
      label:
        'I want more freedom',
    },

    {
      value: 'build',
      label:
        'I want to build something of my own',
    },

    {
      value: 'strengths',
      label:
        'I want to make better use of what I am good at',
    },

    {
      value: 'explore',
      label:
        'I want to explore something new',
    },

    {
      value: 'uncertain',
      label:
        "I'm not really sure yet",
    },
  ];

export const barrierOptions: DiscoveryOption[] =
  [
    {
      value: 'choice',
      label:
        "I don't know what to choose",
    },

    {
      value: 'wrong_choice',
      label:
        "I'm afraid of making the wrong decision",
    },

    {
      value: 'time',
      label:
        "I don't have enough time",
    },

    {
      value: 'start',
      label:
        "I don't know where to start",
    },

    {
      value: 'second_guess',
      label:
        'I keep second-guessing myself',
    },

    {
      value: 'people',
      label:
        "I don't have the right people around me",
    },

    {
      value: 'capability',
      label:
        "I don't know if I'm capable",
    },

    {
      value: 'possibilities',
      label:
        'I have too many possibilities',
    },

    {
      value: 'nothing',
      label:
        "Nothing is really stopping me — I just haven't started",
    },
  ];

export const readinessOptions = [
  {
    value: 1,
    label:
      "I'm just exploring",
  },

  {
    value: 2,
    label:
      "I'm curious",
  },

  {
    value: 3,
    label:
      'I know something needs to change',
  },

  {
    value: 4,
    label:
      "I'm ready to start",
  },

  {
    value: 5,
    label:
      "I'm ready to seriously commit",
  },
];