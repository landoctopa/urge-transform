import { notFound } from 'next/navigation';

import { ProgramMissionShell } from '@/components/program/ProgramMissionShell';

import { getMission } from '@/lib/program/getMission';

import {getContainerNodes,getNode} from '@/lib/program/getCurrentNode';

import { createInitialProgress } from '@/lib/program/progress';

interface MissionPageProps {
  params: Promise<{missionId: string;}>; 
  searchParams: Promise<{node?: string;}>;
}

export default async function MissionPage({params,searchParams}: MissionPageProps) {
  const { missionId } = await params;
  const { node: nodeKey } = await searchParams;

  const mission = getMission(missionId);

  if (!mission) { notFound();}

  const missionNodes = getContainerNodes( mission, 'mission', mission.key);

  if (missionNodes.length === 0) { notFound();}

  let initialNode;

  if (nodeKey) {
    initialNode = getNode(mission, nodeKey);

    if ( !initialNode || initialNode.container.type !== 'mission' ) {
      notFound();
    }
  } else {
    initialNode = missionNodes[0];
  }

  const progress = createInitialProgress( mission.key );

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-20 xl:grid-cols-[minmax(0,1fr)_18rem]">
          {/* Main content */}
          <section className="min-w-0 max-w-4xl">
            <header className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Mission {mission.sequence} · {mission.title}
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                {mission.title}
              </h1>

              {mission.description && (
                <p className="mt-8 w-full text-md font-regular leading-sm/6 text-muted-foreground">
                  {mission.description}
                </p>
              )}

              {mission.bigQuestion && (
                <blockquote className="mt-10 w-full text-lg leading-sm/6 italic text-primary">
                  {mission.bigQuestion}
                </blockquote>
              )}
            </header>

            <ProgramMissionShell
              mission={mission}
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
                    Mission {mission.sequence}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    0%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-0 rounded-full bg-primary" />
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Your progress will appear here as you move
                  through the mission.
                </p>
              </section>

              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Current mission
                </p>

                <p className="mt-4 text-lg font-semibold">
                  {mission.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {missionNodes.length} nodes in this mission.
                </p>
              </section>

              <section className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Resources
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-base font-medium">
                      Founder story
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      A story related to this mission.
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-medium">
                      Useful worksheet
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      A simple exercise to support your work.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-muted p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Need help?
                </p>

                <p className="mt-3 text-base leading-7">
                  Ask the Urge community about what you&apos;re
                  working on.
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