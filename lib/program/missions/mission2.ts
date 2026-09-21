import type { ProgramMission } from '@/lib/program/types';

export const mission2: ProgramMission = {
  key: 'mission-2',
  version: 1,
  title: 'Discover Opportunities',
  sequence: 2,
  bigQuestion:
    'Are there problems you can observe that are worth solving?',
  description:
    'Good business opportunities often begin with noticing something that other people have learned to live with. This mission is about learning to look at the world differently, noticing problems worth solving, turning observations into opportunities, and deciding which opportunity deserves your attention.',
  estimatedDays: 14,
  assets: {
    video: null,
    audio: null,
  },
  context: [
    'user.profile',
    'user.opportunities',
    'user.observations',
    'user.contacts',
    'mission.progress',
  ],

  nodes: [
    // -----------------------------------------------------------------------
    // QUEST 1 — OBSERVE
    // -----------------------------------------------------------------------

    {
      key: 'm2-situation',
      role: 'situation',
      container: {
        type: 'mission',
        key: 'mission-2',
      },
      sequence: 1,
      component: 'opportunity_starting_point',
      title: 'How Do You Find Business Ideas?',
      behavioralIntent:
        'Help the user recognize how they currently look for business ideas and what they tend to pay attention to.',
      context: [
        'user.profile',
        'user.opportunities',
        'mission.progress',
      ],
      outputs: [
        'user_progress.payload.mission_starting_point',
      ],
    },

    {
      key: 'm2-q1-complication',
      role: 'complication',
      container: {
        type: 'quest',
        key: 'm2-q1',
      },
      sequence: 2,
      component: 'why_observation_matters',
      title: 'Stop Looking for Ideas',
      behavioralIntent:
        'Create tension around the habit of trying to invent business ideas instead of noticing problems that already exist.',
      context: [
        'm2-situation',
        'user.opportunities',
        'mission.progress',
      ],
      dependencies: [
        'm2-situation',
      ],
      outputs: [
        'user_progress.payload.idea_hunting_belief',
      ],
    },

    {
      key: 'm2-q1-focus',
      role: 'investigation',
      container: {
        type: 'quest',
        key: 'm2-q1',
      },
      sequence: 3,
      component: 'problem_focus_explorer',
      title: 'Where Do Problems Come From?',
      behavioralIntent:
        'Help the user learn where useful problems can be noticed by directing their attention toward personal experience, expertise, people around them, trends, and changes in the wider world.',
      context: [
        'm2-q1-complication',
        'user.profile',
        'mission.progress',
      ],
      dependencies: [
        'm2-q1-complication',
      ],
      outputs: [
        'user_progress.payload.problem_focus_areas',
      ],
      resources: [
        {
          key: 'discovering-problems',
          type: 'guide',
        },
      ],
    },

    {
      key: 'm2-q1-observe',
      role: 'investigation',
      container: {
        type: 'quest',
        key: 'm2-q1',
      },
      sequence: 4,
      component: 'observation_capture',
      title: 'Go Observe',
      behavioralIntent:
        'Move the user from thinking about problems to actively noticing and recording problems in the real world.',
      context: [
        'm2-q1-focus',
        'user.observations',
        'user.profile',
        'mission.progress',
      ],
      dependencies: [
        'm2-q1-focus',
      ],
      outputs: [
        'user_observations',
        'user_progress.payload.observation_session',
      ],
      interaction: {
        type: 'real_world_action',
        requiresReturn: true,
        reflection: true,
      },
    },

    {
      key: 'm2-q1-reveal',
      role: 'reveal',
      container: {
        type: 'quest',
        key: 'm2-q1',
      },
      sequence: 5,
      component: 'observation_synthesis',
      title: 'What Did You Notice?',
      behavioralIntent:
        'Help the user recognize patterns in what they observed and understand how observation changes the way they see business opportunities.',
      context: [
        'm2-q1-observe',
        'user.observations',
        'mission.progress',
      ],
      dependencies: [
        'm2-q1-observe',
      ],
      outputs: [
        'user_progress.payload.observation_reveal',
      ],
      ai: {
        enabled: true,
        purpose: 'synthesize_observations',
        persistResponse: true,
      },
    },

    {
      key: 'm2-q1-decision',
      role: 'decision',
      container: {
        type: 'quest',
        key: 'm2-q1',
      },
      sequence: 6,
      component: 'observation_commitment',
      title: 'Keep Looking',
      behavioralIntent:
        'Turn the insight from the observation exercise into a commitment to keep noticing problems instead of immediately jumping to solutions.',
      context: [
        'm2-q1-reveal',
        'user.observations',
        'mission.progress',
      ],
      dependencies: [
        'm2-q1-reveal',
      ],
      outputs: [
        'user_commitments',
        'user_progress.payload.observation_commitment',
      ],
    },
  ],
};