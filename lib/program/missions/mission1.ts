// lib/program/missions/mission1.ts

import type { ProgramMission } from '@/lib/program/types';

const mission1: ProgramMission = {
  key: 'mission-1',
  version: 1,
  title: 'Move Before Ready',
  sequence: 1,
  bigQuestion:
    'Can you become someone who moves before they feel ready?',

  description:
    "Most people don't fail to start because they don't have an idea. They fail to start because starting asks them to act before they feel ready. This mission is about finding out what is really holding you back, seeing what you already have, asking for help, facing discomfort, and proving to yourself that you can move anyway.",
  estimatedDays: 14,
  assets: {
    video: null,
    audio: null,
  },
  context: [
    'user.profile',
    'user.opportunities',
    'user.contacts',
    'user.observations',
    'mission.progress',
  ],

  nodes: [

    // ============================================================
    // MISSION ENTRY
    // ============================================================

    {
      key: 'm1-situation',
      role: 'situation',

      container: {
        type: 'mission',
        key: 'mission-1',
      },

      sequence: 1,

      component: 'situation_explorer',

      title: 'Where are you right now?',

      behavioralIntent:
        'Surface the user’s actual starting point without trying to solve anything yet.',

      context: [
        'user.profile',
        'user.opportunities',
      ],

      dependencies: [],

      outputs: [
        'user_profile.mission_starting_point',
        'user_opportunities',
      ],

      metadata: {
        canCreateOpportunity: true,
        allowMultipleOpportunities: true,
      },

      resources: [],
      stories: [],
    },

    // ============================================================
    // QUEST 1 — THE LINE IN THE SAND
    // ============================================================

    {
      key: 'm1-q1-complication',
      role: 'complication',

      container: {
        type: 'quest',
        key: 'm1-q1',
      },

      sequence: 2,

      component: 'why_havent_you_started',

      title: "Why haven't you started?",

      behavioralIntent:
        'Turn vague hesitation into explicit barriers, fears, and reasons for inaction.',

      context: [
        'user.profile',
        'm1-situation',
      ],

      dependencies: [
        'm1-situation',
      ],

      outputs: [
        'user_profile.perceived_barriers',
        'user_profile.fears',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q1-motivation',
      role: 'investigation',
      container: {
        type: 'quest',
        key: 'm1-q1',
      },
      sequence: 3,
      component: 'motivation_explorer',
      title: 'But you are still here.',
      behavioralIntent:
        'Help the user discover the force that keeps bringing them back to this dream despite their resistance.',
      context: [
        'user.profile',
        'm1-situation',
        'm1-q1-complication',
      ],
      dependencies: [
        'm1-q1-complication',
      ],

      outputs: [
        'user_profile.motivations',
      ],
      resources: [],
      stories: [],
    },

    {
      key: 'm1-q1-future',
      role: 'investigation',
      container: {
        type: 'quest',
        key: 'm1-q1',
      },
      sequence: 4,
      component: 'future_state_explorer',
      title: 'What would be different?',
      behavioralIntent:
        'Make the desired change concrete enough that it becomes personally meaningful.',
      context: [
        'user.profile',
        'm1-q1-complication',
        'm1-q1-motivation',
      ],
      dependencies: ['m1-q1-motivation'],
      outputs: ['user_profile.desired_future'],
      resources: [],
      stories: [],
    },

    {
      key: 'm1-q1-quit',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q1',
      },

      sequence: 5,

      component: 'quit_condition_explorer',

      title: 'What might make you quit?',

      behavioralIntent:
        'Anticipate the moments when motivation will no longer be enough.',

      context: [
        'user.profile',
        'm1-q1-motivation',
        'm1-q1-future',
      ],

      dependencies: [
        'm1-q1-future',
      ],

      outputs: [
        'user_profile.quit_conditions',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q1-reveal',
      role: 'reveal',

      container: {
        type: 'quest',
        key: 'm1-q1',
      },

      sequence: 6,

      component: 'commitment_synthesis',

      title: 'Look at what is actually driving you.',

      behavioralIntent:
        'Synthesize the user’s resistance, motivation, desired future, and likely quit conditions into a coherent personal picture.',

      context: [
        'user.profile',
        'm1-q1-complication',
        'm1-q1-motivation',
        'm1-q1-future',
        'm1-q1-quit',
      ],

      dependencies: [
        'm1-q1-complication',
        'm1-q1-motivation',
        'm1-q1-future',
        'm1-q1-quit',
      ],

      outputs: [
        'user_progress.ai_data',
        'ai_log',
      ],

      ai: {
        enabled: true,
        purpose: 'synthesize',
        persistResponse: true,
      },

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q1-decision',
      role: 'decision',

      container: {
        type: 'quest',
        key: 'm1-q1',
      },

      sequence: 7,

      component: 'minimum_commitment',

      title: 'Draw your line in the sand.',

      behavioralIntent:
        'Convert desire into a commitment to act despite a named source of discomfort or uncertainty.',

      context: [
        'user.profile',
        'm1-q1-reveal',
      ],

      dependencies: [
        'm1-q1-reveal',
      ],

      outputs: [
        'user_commitments',
        'user_tasks',
      ],

      resources: [],
      stories: [],
    },

    // ============================================================
    // QUEST 2 — WHAT YOU ALREADY HAVE
    // ============================================================

    {
      key: 'm1-q2-complication',
      role: 'complication',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 8,

      component: 'deficit_explorer',

      title: 'You think you are starting from zero. Are you?',

      behavioralIntent:
        'Make the user explicitly state the resources they believe are missing before showing them what they actually have.',

      context: [
        'user.profile',
        'm1-q1-decision',
      ],

      dependencies: [
        'm1-q1-decision',
      ],

      outputs: [
        'user_profile.perceived_deficits',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q2-resources',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 9,

      component: 'resource_inventory',

      title: 'Take stock.',

      behavioralIntent:
        'Replace an abstract feeling of scarcity with a concrete inventory of time, money, tools, and other usable resources.',

      context: [
        'user.profile',
        'm1-q2-complication',
      ],

      dependencies: [
        'm1-q2-complication',
      ],

      outputs: [
        'user_profile.resources',
        'user_profile.constraints',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q2-network',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 10,

      component: 'network_mapper',

      title: 'Who is already within reach?',

      behavioralIntent:
        'Help the user recognize relationships, access, and social proximity as potential startup assets.',

      context: [
        'user.profile',
        'user.contacts',
        'm1-q2-complication',
      ],

      dependencies: [
        'm1-q2-complication',
      ],

      outputs: [
        'user_contacts',
        'user_profile.network_context',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q2-capabilities',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 11,

      component: 'capability_inventory',

      title: 'What can you already do?',

      behavioralIntent:
        'Surface skills, knowledge, tools, and practical capabilities the user may be undervaluing.',

      context: [
        'user.profile',
        'm1-q2-complication',
      ],

      dependencies: [
        'm1-q2-complication',
      ],

      outputs: [
        'user_profile.capabilities',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q2-experience',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 12,

      component: 'experience_miner',

      title: 'What have you already lived through?',

      behavioralIntent:
        'Turn past work, projects, problems solved, communities, and lived experience into recognizable assets.',

      context: [
        'user.profile',
        'm1-q2-complication',
        'm1-q2-capabilities',
      ],

      dependencies: [
        'm1-q2-capabilities',
      ],

      outputs: [
        'user_profile.experience',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q2-reveal',
      role: 'reveal',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 13,

      component: 'starting_assets_reveal',

      title: 'You are not starting from zero.',

      behavioralIntent:
        'Compare perceived scarcity with actual assets while honestly identifying the gaps that remain.',

      context: [
        'user.profile',
        'm1-q2-complication',
        'm1-q2-resources',
        'm1-q2-network',
        'm1-q2-capabilities',
        'm1-q2-experience',
      ],

      dependencies: [
        'm1-q2-resources',
        'm1-q2-network',
        'm1-q2-capabilities',
        'm1-q2-experience',
      ],

      outputs: [
        'user_progress.ai_data',
        'ai_log',
      ],

      ai: {
        enabled: true,
        purpose: 'compare_perceived_and_actual_assets',
        persistResponse: true,
      },

      resources: [],
      stories: [
        {
          key: 'starting_with_less',
          type: 'contextual',
          required: false,
        },
      ],
    },

    {
      key: 'm1-q2-decision',
      role: 'decision',

      container: {
        type: 'quest',
        key: 'm1-q2',
      },

      sequence: 14,

      component: 'gap_action_planner',

      title: 'What actually needs work?',

      behavioralIntent:
        'Separate genuine constraints from imagined deficits and turn the meaningful gaps into small actions.',

      context: [
        'user.profile',
        'm1-q2-reveal',
      ],

      dependencies: [
        'm1-q2-reveal',
      ],

      outputs: [
        'user_tasks',
        'user_profile',
      ],

      resources: [
        {
          key: 'grow-your-network',
          type: 'guide',
          required: false,
        },
        {
          key: 'start-saving',
          type: 'guide',
          required: false,
        },
        {
          key: 'time-management',
          type: 'guide',
          required: false,
        },
      ],

      stories: [],
    },

    // ============================================================
    // QUEST 3 — MAKE THE ASK
    // ============================================================

    {
      key: 'm1-q3-complication',
      role: 'complication',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 15,

      component: 'ask_readiness',

      title: 'How comfortable are you asking?',

      behavioralIntent:
        'Establish a baseline for the user’s comfort with approaching people and asking for something.',

      context: [
        'user.profile',
        'm1-q2-decision',
      ],

      dependencies: [
        'm1-q2-decision',
      ],

      outputs: [
        'user_progress.payload.ask_confidence_before',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q3-squad',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 16,

      component: 'squad_builder',

      title: 'Build your squad.',

      behavioralIntent:
        'Create a real support network around the user and make asking for support a first low-risk practice.',

      context: [
        'user.profile',
        'user.contacts',
        'm1-q3-complication',
      ],

      dependencies: [
        'm1-q3-complication',
      ],

      outputs: [
        'user_contacts',
        'user_tasks',
        'user_observations',
      ],

      resources: [],
      stories: [
        {
          key: 'founder_support_squad',
          type: 'contextual',
          required: false,
        },
      ],
    },

    {
      key: 'm1-q3-visible',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 17,

      component: 'visibility_action',

      title: 'Make yourself visible.',

      behavioralIntent:
        'Move the user from private intention into public action.',

      context: [
        'user.profile',
        'user.contacts',
        'm1-q3-squad',
      ],

      dependencies: [
        'm1-q3-squad',
      ],

      outputs: [
        'user_tasks',
        'user_observations',
      ],

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q3-ask',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 18,

      component: 'real_world_ask',

      title: 'Ask someone who owes you nothing.',

      behavioralIntent:
        'Create a real-world corrective experience: the user prepares an ask, makes it, experiences the response, and reflects on what actually happened.',

      context: [
        'user.profile',
        'user.contacts',
        'user.opportunities',
        'm1-q3-complication',
        'm1-q3-squad',
        'm1-q3-visible',
      ],

      dependencies: [
        'm1-q3-visible',
      ],

      outputs: [
        'user_tasks',
        'user_observations',
        'user_progress.payload',
      ],

      interaction: {
        type: 'real_world_action',
        requiresReturn: true,
        reflection: true,
      },

      resources: [
        {
          key: 'how-to-make-an-ask',
          type: 'guide',
          required: false,
        },
      ],

      stories: [
        {
          key: 'someone_who_asked',
          type: 'contextual',
          required: false,
        },
      ],
    },

    {
      key: 'm1-q3-reveal',
      role: 'reveal',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 19,

      component: 'ask_confidence_reveal',

      title: 'How did reality compare with your prediction?',

      behavioralIntent:
        'Compare the user’s initial belief about asking with evidence from what they actually did.',

      context: [
        'm1-q3-complication',
        'm1-q3-squad',
        'm1-q3-visible',
        'm1-q3-ask',
        'user.observations',
      ],

      dependencies: [
        'm1-q3-ask',
      ],

      outputs: [
        'user_progress.ai_data',
        'ai_log',
      ],

      ai: {
        enabled: true,
        purpose: 'compare_prediction_with_observation',
        persistResponse: true,
      },

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q3-decision',
      role: 'decision',

      container: {
        type: 'quest',
        key: 'm1-q3',
      },

      sequence: 20,

      component: 'asker_debrief',

      title: 'What did this teach you about yourself?',

      behavioralIntent:
        'Turn the experience into a specific insight about the user’s relationship with asking, discomfort, rejection, money, strangers, or follow-up.',

      context: [
        'user.profile',
        'm1-q3-reveal',
        'user.observations',
      ],

      dependencies: [
        'm1-q3-reveal',
      ],

      outputs: [
        'user_progress.payload',
        'user_tasks',
        'user_profile',
      ],

      resources: [],
      stories: [],
    },

    // ============================================================
    // QUEST 4 — TEST YOUR FEAR
    // ============================================================

    {
      key: 'm1-q4-fear',
      role: 'complication',

      container: {
        type: 'quest',
        key: 'm1-q4',
      },

      sequence: 21,

      component: 'fear_explorer',

      title: 'What are you actually afraid will happen?',

      behavioralIntent:
        'Move from a generic fear of rejection to the specific consequence the user is trying to avoid.',

      context: [
        'user.profile',
        'm1-q1-complication',
        'm1-q3-ask',
        'm1-q3-reveal',
        'm1-q3-decision',
      ],

      dependencies: [
        'm1-q3-decision',
      ],

      outputs: [
        'user_profile.fears',
        'user_progress.payload',
      ],

      resources: [],
      stories: [
        {
          key: 'fear_of_rejection',
          type: 'contextual',
          required: false,
        },
      ],
    },

    {
      key: 'm1-q4-warmup',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q4',
      },

      sequence: 22,

      component: 'low_threshold_ask',

      title: 'Let’s make one small ask.',

      behavioralIntent:
        'Give the user another safe opportunity to experience asking and observe their emotional response.',

      context: [
        'user.profile',
        'm1-q4-fear',
        'user.contacts',
      ],

      dependencies: [
        'm1-q4-fear',
      ],

      outputs: [
        'user_tasks',
        'user_observations',
        'user_progress.payload',
      ],

      interaction: {
        type: 'real_world_action',
        requiresReturn: true,
        reflection: true,
      },

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q4-stretch',
      role: 'investigation',

      container: {
        type: 'quest',
        key: 'm1-q4',
      },

      sequence: 23,

      component: 'fear_challenge',

      title: 'Now make the ask you actually want to avoid.',

      behavioralIntent:
        'Create a personalized exposure experience around the user’s actual fear while preserving agency and safety.',

      context: [
        'user.profile',
        'user.opportunities',
        'user.contacts',
        'm1-q1-complication',
        'm1-q3-ask',
        'm1-q4-fear',
        'user.observations',
      ],

      dependencies: [
        'm1-q4-warmup',
      ],

      outputs: [
        'user_tasks',
        'user_observations',
        'user_progress.payload',
      ],

      interaction: {
        type: 'ai_personalized_real_world_action',
        requiresReturn: true,
        reflection: true,
      },

      ai: {
        enabled: true,
        purpose: 'personalize_fear_challenge',
        persistResponse: true,
      },

      resources: [
        {
          key: 'art-of-the-ask',
          type: 'guide',
          required: false,
        },
      ],

      stories: [
        {
          key: 'founder_after_rejection',
          type: 'contextual',
          required: false,
        },
      ],
    },

    {
      key: 'm1-q4-reveal',
      role: 'reveal',

      container: {
        type: 'quest',
        key: 'm1-q4',
      },

      sequence: 24,

      component: 'fear_evidence_reveal',

      title: 'Fear vs. reality.',

      behavioralIntent:
        'Show the user what they predicted would happen versus what actually happened, without forcing a positive interpretation.',

      context: [
        'user.profile',
        'm1-q4-fear',
        'm1-q4-warmup',
        'm1-q4-stretch',
        'user.observations',
      ],

      dependencies: [
        'm1-q4-stretch',
      ],

      outputs: [
        'user_progress.ai_data',
        'ai_log',
      ],

      ai: {
        enabled: true,
        purpose: 'fear_vs_reality_analysis',
        persistResponse: true,
      },

      resources: [],
      stories: [],
    },

    {
      key: 'm1-q4-decision',
      role: 'decision',

      container: {
        type: 'quest',
        key: 'm1-q4',
      },

      sequence: 25,

      component: 'fear_audit',

      title: 'What will you do even when you are afraid?',

      behavioralIntent:
        'Convert the evidence into an ongoing behavioral stance rather than claiming the fear has disappeared.',

      context: [
        'user.profile',
        'm1-q4-fear',
        'm1-q4-reveal',
      ],

      dependencies: [
        'm1-q4-reveal',
      ],

      outputs: [
        'user_commitments',
        'user_tasks',
        'user_progress.payload',
      ],

      resources: [],
      stories: [],
    },

    // ============================================================
    // MISSION REVEAL
    // ============================================================

    {
      key: 'm1-big-reveal',
      role: 'reveal',

      container: {
        type: 'mission',
        key: 'mission-1',
      },

      sequence: 26,

      component: 'mission_transformation',

      title: 'Look at how far you moved.',

      behavioralIntent:
        'Make the transformation visible by connecting the user’s starting beliefs to the evidence they generated through action.',

      context: [
        'user.profile',
        'user.opportunities',
        'user.contacts',
        'user.observations',
        'mission.progress',
        'm1-q1-complication',
        'm1-q1-reveal',
        'm1-q1-decision',
        'm1-q2-complication',
        'm1-q2-reveal',
        'm1-q2-decision',
        'm1-q3-complication',
        'm1-q3-ask',
        'm1-q3-reveal',
        'm1-q3-decision',
        'm1-q4-fear',
        'm1-q4-reveal',
        'm1-q4-decision',
      ],

      dependencies: [
        'm1-q4-decision',
      ],

      outputs: [
        'user_progress.ai_data',
        'ai_log',
      ],

      ai: {
        enabled: true,
        purpose: 'mission_transformation_synthesis',
        persistResponse: true,
      },

      resources: [],
      stories: [],
    },

    // ============================================================
    // MISSION DECISION
    // ============================================================

    {
      key: 'm1-decision',
      role: 'decision',

      container: {
        type: 'mission',
        key: 'mission-1',
      },

      sequence: 27,

      component: 'mission_commitment',

      title: 'Are you ready to move before ready?',

      behavioralIntent:
        'Have the user reassess readiness using the same lens as the beginning, review the evidence of action, and commit to carrying this new behavior into opportunity hunting.',

      context: [
        'user.profile',
        'mission.progress',
        'm1-situation',
        'm1-big-reveal',
        'user.tasks',
        'user.observations',
        'user_commitments',
      ],

      dependencies: [
        'm1-big-reveal',
      ],

      outputs: [
        'user_progress.payload',
        'user_commitments',
        'user_tasks',
      ],

      metadata: {
        nextMission: 'mission-2',
        readinessReassessment: true,
        accountabilityCheck: true,
      },

      resources: [],
      stories: [],
    },
  ],
};

export default mission1;