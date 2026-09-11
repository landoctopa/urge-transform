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

    subheadline: hurdleCopy.subheadline,

    reasons: [
      {
        title: 'Find your starting point',
        description:
          situationCopy.startingPoint,
      },
      {
        title: 'Turn uncertainty into movement',
        description:
          hurdleCopy.movement,
      },
      {
        title: 'Build something real',
        description:
          'Urge takes you through the fundamentals of building a business by actually applying them to something that could be yours.',
      },
      {
        title: 'You are not doing it alone',
        description:
          'Your journey comes with a community of people building too, regular live sessions, mentors and access to experts when you need them.',
      },
      {
        title: 'Start without betting everything',
        description:
          'You do not need to quit your job, raise money or build everything at once. Start small, test what works and learn from what happens.',
      },
    ],

    closing:
      'You do not need to know exactly where this ends. You need somewhere worth starting.',
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
    return 'You may not need an idea yet.';
  }

  if (
    situation === 'idea' &&
    hurdle === 'idea_confidence'
  ) {
    return 'Your idea does not have to be perfect.';
  }

  if (
    situation === 'career_shift' &&
    hurdle === 'overthinking'
  ) {
    return 'You have spent enough time thinking about it.';
  }

  if (
    situation === 'existing_skill' &&
    hurdle === 'knowhow'
  ) {
    return 'You may already have more to start with than you think.';
  }

  if (
    situation === 'previous_attempt'
  ) {
    return 'Maybe you did not fail. Maybe you just needed a better way to move.';
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
    return 'You do not need unlimited time to begin.';
  }

  return 'You probably have more to start with than you think.';
}

function getSituationCopy(
  situation: DiscoverySituation,
) {
  switch (situation) {
    case 'idea':
      return {
        eyebrow: 'YOU HAVE SOMETHING IN MIND',
        startingPoint:
          'We help you turn the idea from something you keep thinking about into something you can actually test.',
      };

    case 'something_of_my_own':
      return {
        eyebrow: 'YOU WANT SOMETHING OF YOUR OWN',
        startingPoint:
          'You do not need to arrive with a business idea. We help you discover what might be worth building from what you already know, see and care about.',
      };

    case 'career_shift':
      return {
        eyebrow: 'YOU ARE READY FOR SOMETHING DIFFERENT',
        startingPoint:
          'Your years of experience are not baggage. They are raw material. Urge helps you turn what you have learned into something that could be yours.',
      };

    case 'existing_skill':
      return {
        eyebrow: 'YOU ALREADY HAVE SOMETHING USEFUL',
        startingPoint:
          'Skills, experience, relationships and problems you understand can all become starting points for a business.',
      };

    case 'previous_attempt':
      return {
        eyebrow: 'YOU HAVE ALREADY TRIED',
        startingPoint:
          'You do not need to start from zero. What happened before can become useful information for deciding what to do differently now.',
      };

    case 'not_sure':
      return {
        eyebrow: 'YOU ARE STARTING WITH A QUESTION',
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
          'Urge gives you the fundamentals at the moment you need them, then asks you to apply them to your own situation.',
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