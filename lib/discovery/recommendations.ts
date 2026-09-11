// lib/discovery/recommendations.ts

import type {
  DiscoveryHurdle,
  DiscoveryReveal,
  DiscoverySituation,
} from './types';

export function getDiscoveryReveal(
  situation: DiscoverySituation,
  hurdle: DiscoveryHurdle,
): DiscoveryReveal {
  const situationCopy =
    getSituationCopy(situation);

  const hurdleCopy =
    getHurdleCopy(hurdle);

  return {
    eyebrow: situationCopy.eyebrow,

    headline: buildHeadline(
      situation,
      hurdle,
    ),

    subheadline:
      'This is exactly the kind of starting point Urge is built for.',

    recognition:
      buildRecognition(
        situation,
        hurdle,
      ),

    support: [
      {
        title: 'Find your way forward',
        description:
          situationCopy.startingPoint,
      },
      {
        title: 'Turn the block into movement',
        description:
          hurdleCopy.movement,
      },
      {
        title: 'Build by doing',
        description:
          'The Urge program takes you through the fundamentals of building a business by applying them to something that could actually be yours.',
      },
    ],

    ecosystemIntro:
      'But the program is only part of it. We know that building something real takes more than a set of lessons.',

    ecosystem: [
      {
        title: 'Guidance',
        description:
          'Regular events and online standups give you a place to ask questions, get perspective and know what to do next.',
      },
      {
        title: 'Accountability',
        description:
          'Momentum is easier when other people know what you are trying to do. Urge gives you people who will keep you moving.',
      },
      {
        title: 'Community',
        description:
          'An internal ecosystem of people building too — where you can test ideas, make connections, ask for help and find people who can open a door.',
      },
      {
        title: 'Expertise',
        description:
          'Mentors and industry experts bring experience when you need another perspective, deeper knowledge or help avoiding an expensive mistake.',
      },
      {
        title: 'Tools & resources',
        description:
          'Practical tools, resources and frameworks help you spend less time figuring out the basics and more time making progress.',
      },
      {
        title: 'Launch',
        description:
          'The goal is not to finish a course. It is to get something real into the world and learn from what happens.',
      },
    ],

    closing:
      'You do not need to have the whole thing figured out. You need a place to start — and people who will help you keep going.',
  };
}

function buildHeadline(
  situation: DiscoverySituation,
  hurdle: DiscoveryHurdle,
): string {
  if (
    situation === 'not_sure' &&
    hurdle === 'dont_know_what'
  ) {
    return 'You do not need an idea. You need a way to find one.';
  }

  if (
    situation === 'idea' &&
    hurdle === 'idea_confidence'
  ) {
    return 'You do not need more certainty. You need a way to test it.';
  }

  if (
    situation === 'career_shift' &&
    hurdle === 'overthinking'
  ) {
    return 'You need somewhere to turn that intention into action.';
  }

  if (
    situation === 'existing_skill' &&
    hurdle === 'knowhow'
  ) {
    return 'You may already have the raw material. Urge helps you turn it into something real.';
  }

  if (
    situation === 'previous_attempt'
  ) {
    return 'You do not have to start over. You can start differently.';
  }

  if (
    hurdle === 'lack_of_people'
  ) {
    return 'You should not have to figure this out alone.';
  }

  if (
    hurdle === 'risk'
  ) {
    return 'Starting does not have to mean betting everything.';
  }

  if (
    hurdle === 'time'
  ) {
    return 'You do not need more time. You need a way to make the time you have count.';
  }

  if (
    hurdle === 'overthinking'
  ) {
    return 'Urge helps you turn thinking into movement.';
  }

  if (
    hurdle === 'dont_know_where'
  ) {
    return 'Urge gives you a way to know what to do next.';
  }

  if (
    hurdle === 'dont_know_what'
  ) {
    return 'Urge helps you discover what is worth building.';
  }

  if (
    hurdle === 'knowhow'
  ) {
    return 'You are not supposed to know how to build a business before you start.';
  }

  return 'This is where Urge can help.';
}

function buildRecognition(
  situation: DiscoverySituation,
  hurdle: DiscoveryHurdle,
): string {
  if (
    situation === 'previous_attempt'
  ) {
    return 'A lot of people who want to build something have started before, stopped somewhere along the way, and wondered whether they simply were not cut out for it. Often the problem is not the person. It is not having the right way to move forward.';
  }

  if (
    situation === 'not_sure'
  ) {
    return 'A lot of people start here. They know they want something of their own, but they do not have a perfectly formed idea waiting for them. That is not a weakness. It is a starting point.';
  }

  if (
    hurdle === 'risk'
  ) {
    return 'A lot of people want to build something of their own but hesitate at the point where ambition starts to feel like risk. You do not have to make an irreversible decision to begin.';
  }

  if (
    hurdle === 'overthinking'
  ) {
    return 'A lot of capable people get stuck here. The desire is real, the thinking is constant, but turning intention into action is harder than it looks.';
  }

  if (
    hurdle === 'dont_know_what'
  ) {
    return 'A lot of people want to start before they know exactly what they should start. The expectation that you need a brilliant idea first can be one of the things that keeps you from beginning.';
  }

  if (
    hurdle === 'lack_of_people'
  ) {
    return 'A lot of people underestimate how much easier it is to build when you have people around you who understand what you are trying to do.';
  }

  return 'A lot of people who want to build something of their own find themselves in this exact tension: they want to move, but something keeps getting in the way.';
}

function getSituationCopy(
  situation: DiscoverySituation,
) {
  switch (situation) {
    case 'idea':
      return {
        eyebrow:
          'YOU HAVE SOMETHING IN MIND',

        startingPoint:
          'We help you take the idea out of your head and start understanding whether there is something real worth building around it.',
      };

    case 'something_of_my_own':
      return {
        eyebrow:
          'YOU WANT SOMETHING OF YOUR OWN',

        startingPoint:
          'You do not need to arrive with a business idea. We help you discover possibilities from your experience, skills, interests and the problems you understand.',
      };

    case 'career_shift':
      return {
        eyebrow:
          'YOU ARE READY FOR SOMETHING DIFFERENT',

        startingPoint:
          'Your years of experience are not baggage. They are raw material. Urge helps you turn what you have learned into something that could be yours.',
      };

    case 'existing_skill':
      return {
        eyebrow:
          'YOU ALREADY HAVE SOMETHING USEFUL',

        startingPoint:
          'Skills, experience, relationships and problems you understand can all become starting points for a business.',
      };

    case 'previous_attempt':
      return {
        eyebrow:
          'YOU HAVE ALREADY TRIED',

        startingPoint:
          'You do not need to start from zero. What happened before becomes useful information for deciding what to do differently now.',
      };

    case 'not_sure':
      return {
        eyebrow:
          'YOU ARE STARTING WITH A QUESTION',

        startingPoint:
          'That is enough. We help you look at your experience, interests, skills and the problems around you differently.',
      };
  }
}

function getHurdleCopy(
  hurdle: DiscoveryHurdle,
) {
  switch (hurdle) {
    case 'dont_know_what':
      return {
        subheadline:
          'The first job is not to invent a brilliant idea. It is to notice what you already know, understand and have access to.',

        movement:
          'Urge gives you a structured way to explore opportunities without forcing you to chase whatever happens to be fashionable.',
      };

    case 'dont_know_where':
      return {
        subheadline:
          'Knowing that you want to start is very different from knowing what to do Monday morning.',

        movement:
          'Urge gives you a sequence of useful actions so you can stop trying to solve the entire future at once.',
      };

    case 'time':
      return {
        subheadline:
          'You do not need to build everything today. You need a way to make progress with the time you actually have.',

        movement:
          'Urge helps you work within your real constraints rather than waiting for the perfect window to appear.',
      };

    case 'idea_confidence':
      return {
        subheadline:
          'You do not find out whether an idea is good by thinking about it forever.',

        movement:
          'Urge helps you get ideas into the real world early, where people, conversations and evidence can teach you what thinking cannot.',
      };

    case 'knowhow':
      return {
        subheadline:
          'You are not supposed to know how to build a business before you have built one.',

        movement:
          'Urge gives you the fundamentals when you need them, then asks you to apply them to your own situation.',
      };

    case 'risk':
      return {
        subheadline:
          'Starting something of your own does not have to mean throwing away everything you already have.',

        movement:
          'Urge is designed around small, useful steps that let you learn before you make bigger commitments.',
      };

    case 'overthinking':
      return {
        subheadline:
          'Thinking can feel productive right up until it becomes a substitute for doing.',

        movement:
          'Urge is deliberately built around action. Each step gives you something concrete to test, decide or learn.',
      };

    case 'lack_of_people':
      return {
        subheadline:
          'Building something alone can make every uncertainty feel bigger than it is.',

        movement:
          'Urge gives you a community, live sessions, mentors and experts so the next problem does not always have to be solved by yourself.',
      };
  }
}