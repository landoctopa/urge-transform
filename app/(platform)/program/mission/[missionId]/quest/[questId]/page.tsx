import {
  notFound,
} from 'next/navigation';

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
  ProgramQuestShell,
} from '@/components/program/ProgramQuestShell';

interface QuestPageProps {
  params: Promise<{
    missionId: string;
    questId: string;
  }>;

  searchParams: Promise<{
    node?: string;
  }>;
}

export default async function QuestPage({
  params,
  searchParams,
}: QuestPageProps) {
  const {
    missionId,
    questId,
  } = await params;

  const {
    node: nodeKey,
  } = await searchParams;

  const mission =
    getMission(missionId);

  if (!mission) {
    notFound();
  }

  /*
   * Quests are represented by node
   * containers in the current program
   * architecture.
   *
   * There is no mission.quests collection
   * to query here.
   */
  const questNodes =
    getContainerNodes(
      mission,
      'quest',
      questId,
    );

  if (
    questNodes.length ===
    0
  ) {
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
        'quest' ||
      initialNode.container.key !==
        questId
    ) {
      notFound();
    }
  } else {
    initialNode =
      questNodes[0];
  }

  const progress =
    createInitialProgress(
      mission.key,
    );

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 space-y-3">
          <p className="text-sm text-muted-foreground">
            Mission {mission.sequence}
          </p>

          <h1 className="text-3xl font-semibold">
            {questId}
          </h1>
        </header>

        <ProgramQuestShell
          mission={mission}
          questId={questId}
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