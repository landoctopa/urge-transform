import { notFound } from 'next/navigation';

import { ProgramNodeRenderer } from '@/components/program/ProgramNodeRenderer';
import { getMission } from '@/lib/program/getMission';
import { getCurrentNode } from '@/lib/program/getCurrentNode';

interface QuestPageProps {
  params: Promise<{
    missionId: string;
    questId: string;
  }>;
}

export default async function QuestPage({
  params,
}: QuestPageProps) {
  const { missionId, questId } = await params;

  const mission = getMission(missionId);

  if (!mission) {
    notFound();
  }

  const quest = mission.quests?.find(
    (item) => item.key === questId
  );

  if (!quest) {
    notFound();
  }

  // Temporary until user_progress exists.
  const progress = {
    currentNodeKey: undefined,
    completedNodeKeys: [],
  };

  const currentNode = getCurrentNode(
    mission,
    questId,
    progress
  );

  if (!currentNode) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Mission {mission.sequence} · Quest {quest.sequence}
          </p>

          <h1 className="text-3xl font-semibold">
            {quest.title}
          </h1>

          {quest.description && (
            <p className="text-muted-foreground">
              {quest.description}
            </p>
          )}
        </header>

        <div className="text-sm text-muted-foreground">
          Step {currentNode.sequence}
        </div>

        <ProgramNodeRenderer
          node={currentNode}
          context={{}}
          progress={{
            status: 'not_started',
            payload: {},
          }}
          onComplete={async (result) => {
            console.log(
              'Completed:',
              currentNode.key,
              result
            );
          }}
        />
      </div>
    </main>
  );
}