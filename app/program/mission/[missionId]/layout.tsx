import {
  notFound,
} from 'next/navigation';

import {
  getMission,
} from '@/lib/program/getMission';

import {
  getHydrationDomains,
} from '@/lib/program/journey';

import {
  getProgramHydration,
} from '@/lib/program/hydration/server';

import {
  ProgramMissionHydration,
} from '@/components/program/ProgramMissionHydration';

interface MissionLayoutProps {
  children: React.ReactNode;

  params: Promise<{
    missionId: string;
  }>;
}

export default async function MissionLayout({
  children,
  params,
}: MissionLayoutProps) {
  const {
    missionId,
  } = await params;

  const mission =
    getMission(missionId);

  if (!mission) {
    notFound();
  }

  /*
   * Mission-level hydration is determined
   * from the program definition.
   *
   * We intentionally do not hydrate every
   * possible user domain.
   */
  const hydrationDomains =
    getHydrationDomains(
      mission,
    );

  const initialHydration =
    await getProgramHydration({
      missionKey:
        mission.key,

      domains:
        hydrationDomains,
    });

  return (
    <ProgramMissionHydration
      mission={mission}
      initialHydration={
        initialHydration
      }
      hydrationDomains={
        hydrationDomains
      }
    >
      {children}
    </ProgramMissionHydration>
  );
}