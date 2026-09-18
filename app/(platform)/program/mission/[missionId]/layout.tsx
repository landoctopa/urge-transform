import { notFound } from 'next/navigation';

import { getMission } from '@/lib/program/getMission';

export default async function MissionLayout({ children, params,
}: {
  children: React.ReactNode;
  params: Promise<{ missionId: string; }>;
}) {
  const { missionId } = await params;
  const mission = getMission(missionId);

  if (!mission) { notFound(); }

  return (
    <>
      {children}
    </>
  );
}