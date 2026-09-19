import { notFound } from 'next/navigation';

import { ProgramQuestShell } from '@/components/program/ProgramQuestShell';

import { getMission } from '@/lib/program/getMission';

import {
  getContainerNodes,
  getNode,
} from '@/lib/program/getCurrentNode';

import { createInitialProgress } from '@/lib/program/progress';

interface QuestPageProps {
  params: Promise<{
    missionId: string;
    questId: string;
  }>;

  searchParams: Promise<{
    node?: string;
  }>;
}

function formatQuestId(
  questId: string,
) {
  return questId
    .split('-')
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(' ');
}

export default async function QuestPage({
  params,
  searchParams,
}: QuestPageProps) {
  const {
    missionId,
    questId,
  } = await params;

  const { node: nodeKey } =
    await searchParams;

  const mission = getMission(
    missionId,
  );

  if (!mission) {
    notFound();
  }

  const questNodes =
    getContainerNodes(
      mission,
      'quest',
      questId,
    );

  if (questNodes.length === 0) {
    notFound();
  }

  let initialNode;

  if (nodeKey) {
    initialNode = getNode(
      mission,
      nodeKey,
    );

    if (
      !initialNode ||
      initialNode.container.type !== 'quest' ||
      initialNode.container.key !== questId
    ) {
      notFound();
    }
  } else {
    initialNode = questNodes[0];
  }

  const progress =
    createInitialProgress(
      mission.key,
    );

  const questTitle =
    formatQuestId(
      questId,
    );

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_18rem]">
          {/* Main content */}
          <section className="min-w-0 max-w-4xl">
            <header className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Mission {mission.sequence} · Quest
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                {questTitle}
              </h1>

              <p className="mt-6 text-base text-muted-foreground">
                {mission.title}
              </p>
            </header>

            <ProgramQuestShell
              mission={mission}
              questId={questId}
              initialNode={initialNode}
              initialProgress={progress}
            />
          </section>

          {/* Context rail */}
          <aside className="xl:sticky xl:top-8 xl:self-start">
            <div className="space-y-5">
              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Your progress
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-medium">
                    Quest
                  </span>

                  <span className="text-sm text-muted-foreground">
                    0%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-0 rounded-full bg-primary" />
                </div>
              </section>

              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Current quest
                </p>

                <p className="mt-4 text-lg font-semibold">
                  {questTitle}
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {questNodes.length} nodes in this quest.
                </p>
              </section>

              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Resources
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-base font-medium">
                      Useful worksheet
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Something to help you complete this quest.
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-medium">
                      Related story
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      See how another founder approached something similar.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-muted p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Need help?
                </p>

                <p className="mt-3 text-base leading-7">
                  Ask the Urge community about this quest.
                </p>

                <button
                  type="button"
                  className="mt-5 text-base font-medium text-primary"
                >
                  Ask a question →
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}