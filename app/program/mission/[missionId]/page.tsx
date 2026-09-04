import { notFound } from 'next/navigation';

import {
  getMission,
} from '@/lib/program/getMission';

import {
  getContainerNodes,
  getNode,
} from '@/lib/program/getCurrentNode';

import {
  createInitialProgress,
} from '@/lib/program/progress';

import {
  ProgramMissionShell,
} from '@/components/program/ProgramMissionShell';

interface MissionPageProps {
  params: Promise<{
    missionId: string;
  }>;

  searchParams: Promise<{
    node?: string;
  }>;
}

export default async function MissionPage({
  params,
  searchParams,
}: MissionPageProps) {
  const { missionId } =
    await params;

  const { node: nodeKey } =
    await searchParams;

  const mission =
    getMission(missionId);

  if (!mission) {
    notFound();
  }

  const missionNodes =
    getContainerNodes(
      mission,
      'mission',
      mission.key,
    );

  if (missionNodes.length === 0) {
    notFound();
  }

  let initialNode;

  if (nodeKey) {
    initialNode =
      getNode(
        mission,
        nodeKey,
      );

    if (
      !initialNode ||
      initialNode.container.type !==
        'mission'
    ) {
      notFound();
    }
  } else {
    initialNode =
      missionNodes[0];
  }

  const progress =
    createInitialProgress(
      mission.key,
    );

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 space-y-4">
          <p className="text-sm text-muted-foreground">
            Mission {mission.sequence}
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            {mission.title}
          </h1>

          <p className="text-lg text-muted-foreground">
            {mission.description}
          </p>

          {mission.bigQuestion && (
            <blockquote className="border-l-2 pl-5 text-xl italic">
              {mission.bigQuestion}
            </blockquote>
          )}
        </header>

        <ProgramMissionShell
          mission={mission}
          initialNode={
            initialNode
          }
          initialProgress={
            progress
          }
        />
      </div>
    </main>
  );
}