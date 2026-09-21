# Node implementation Flow

we will see on example of Mission node and one of Quest node. You already have latest mission1.ts

## Node (key: 'm1-situation')

- role: 'situation',

- container: type: 'mission',key: 'mission-1'

- component: 'situation_explorer'

i am going to structure this reference backward, starting from page back to mission file.

### Page : app/(platform)/program/mission/[missionId]/page.tsx

```tsx
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
```

Attached Files for reference

1. components/program/ProgramMissionShell.tsx

2. /lib/program/getMission.ts

3. /lib/program/getCurrentNode.ts 

4. /lib/program/progress.ts

5. /lib/program/progressStore.ts

6. /lib/program/context.ts



### Component renderer (components/program/ProgramNodeRenderer.tsx)

```tsx
'use client';

import {
  getProgramComponent,
  type ProgramComponentProps,
} from '@/lib/program/componentRegistry';

interface ProgramNodeRendererProps
  extends ProgramComponentProps {}

export function ProgramNodeRenderer({
  node,
  context,
  progress,
  onComplete,
}: ProgramNodeRendererProps) {
  const Component = getProgramComponent(
    node.component
  );

  return (
    <Component
      node={node}
      context={context}
      progress={progress}
      onComplete={onComplete}
    />
  );
}
```

### Component registry (lib/program/componentRegistry.ts)

```ts
import type { ComponentType } from 'react';
import type { ProgramNode } from './types';
import type {
  ProgramNodeContext,
} from '@/lib/program/context';

import { SituationExplorer } from '@/components/program/mission1/SituationExplorer';
import { WhyHaventYouStarted } from '@/components/program/mission1/WhyHaventYouStarted';
import { MotivationExplorer } from '@/components/program/mission1/MotivationExplorer';
import { FutureStateExplorer } from '@/components/program/mission1/FutureStateExplorer';
import { QuitConditionExplorer } from '@/components/program/mission1/QuitConditionExplorer';
import { CommitmentSynthesis } from '@/components/program/mission1/CommitmentSynthesis';
import { MinimumCommitment } from '@/components/program/mission1/MinimumCommitment';
import { DeficitExplorer } from '@/components/program/mission1/DeficitExplorer';
import { ResourceInventory } from '@/components/program/mission1/ResourceInventory';
import { NetworkMapper } from '@/components/program/mission1/NetworkMapper';
import { CapabilityInventory } from '@/components/program/mission1/CapabilityInventory';
import { ExperienceMiner } from '@/components/program/mission1/ExperienceMiner';
import { StartingAssetsReveal } from '@/components/program/mission1/StartingAssetsReveal';
import { GapActionPlanner } from '@/components/program/mission1/GapActionPlanner';
import { AskReadiness } from '@/components/program/mission1/AskReadiness';
import { SquadBuilder } from '@/components/program/mission1/SquadBuilder';
import { VisibilityAction } from '@/components/program/mission1/VisibilityAction';
import { RealWorldAsk } from '@/components/program/mission1/RealWorldAsk';
import { AskConfidenceReveal } from '@/components/program/mission1/AskConfidenceReveal';
import { AskerDebrief } from '@/components/program/mission1/AskerDebrief';
import { FearExplorer } from '@/components/program/mission1/FearExplorer';
import { LowThresholdAsk } from '@/components/program/mission1/LowThresholdAsk';
import { FearChallenge } from '@/components/program/mission1/FearChallenge';
import { FearEvidenceReveal } from '@/components/program/mission1/FearEvidenceReveal';
import { FearAudit } from '@/components/program/mission1/FearAudit';
import { MissionTransformation } from '@/components/program/mission1/MIssionTransformation';
import { MissionCommitment } from '@/components/program/mission1/MissionCommitment';

export interface ProgramComponentProps {
  node: ProgramNode;

  context: ProgramNodeContext;

  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    payload: Record<string, unknown>;
    aiData?: Record<string, unknown>;
  };

  onComplete: (
    result?: Record<string, unknown>
  ) => Promise<void>;
}

export type ProgramComponent =
  ComponentType<ProgramComponentProps>;

export const componentRegistry: Record<
  string,
  ProgramComponent
> = {
  situation_explorer: SituationExplorer,
  why_havent_you_started: WhyHaventYouStarted,
  motivation_explorer: MotivationExplorer,
  future_state_explorer: FutureStateExplorer,
  quit_condition_explorer: QuitConditionExplorer,
  commitment_synthesis: CommitmentSynthesis,
  minimum_commitment: MinimumCommitment,
  deficit_explorer: DeficitExplorer,
  resource_inventory: ResourceInventory,
  network_mapper: NetworkMapper,
  capability_inventory: CapabilityInventory,
  experience_miner: ExperienceMiner,
  starting_assets_reveal: StartingAssetsReveal,
  gap_action_planner: GapActionPlanner,
  ask_readiness: AskReadiness,
  squad_builder: SquadBuilder,
  visibility_action: VisibilityAction,
  real_world_ask: RealWorldAsk,
  ask_confidence_reveal: AskConfidenceReveal,
  asker_debrief: AskerDebrief,
  fear_explorer: FearExplorer,
  low_threshold_ask: LowThresholdAsk,
  fear_challenge: FearChallenge,
  fear_evidence_reveal: FearEvidenceReveal,
  fear_audit: FearAudit,
  mission_transformation: MissionTransformation,
  mission_commitment: MissionCommitment
};


export function getProgramComponent(
  componentKey: string
): ProgramComponent {
  const component = componentRegistry[componentKey];

  if (!component) {
    throw new Error(
      `Unknown program component: ${componentKey}`
    );
  }

  return component;
}
```



### Component (components/program/mission1/SituationExplorer.tsx)

```tsx
'use client';

import { useState } from 'react';
import { ArrowRight, Lightbulb, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function SituationExplorer({ progress, onComplete}: ProgramComponentProps) {
  const saved = progress.payload ?? {};
  const [situation, setSituation] = useState(typeof saved.situation === 'string' ? saved.situation : '');
  const [idea, setIdea] = useState(typeof saved.idea === 'string' ? saved.idea  : '');
  const [hasIdea, setHasIdea] = useState( typeof saved.hasIdea === 'boolean' ? saved.hasIdea : false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canContinue = situation.trim().length >= 10;

  async function handleSubmit() {
    if (!canContinue || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onComplete({
        situation: situation.trim(),
        hasIdea,
        idea: hasIdea ? idea.trim() : '',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <MapPin className="h-4 w-4" />
          Start here
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Where are you right now?
        </h2>

        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          There is no right starting point. Maybe you already have an
          idea. Maybe you just know you want to build something.
          Tell us what brought you here.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">
          What's going on?
        </label>

        <Textarea
          value={situation}
          onChange={(event) =>
            setSituation(event.target.value)
          }
          placeholder="I've been thinking about starting something because..."
          className="min-h-[150px] resize-none text-base leading-7"
        />

        <p className="text-xs text-muted-foreground">
          Write it the way you would explain it to a friend.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <button
          type="button"
          onClick={() => setHasIdea((value) => !value)}
          className="flex w-full items-start gap-3 text-left"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
              hasIdea
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border'
            }`}
          >
            {hasIdea ? '✓' : ''}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-primary" />
              I already have an idea
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Good. You don't need to figure out whether it's a
              good idea yet. Just put it on the table.
            </p>
          </div>
        </button>

        {hasIdea && (
          <div className="mt-4">
            <Input
              value={idea}
              onChange={(event) =>
                setIdea(event.target.value)
              }
              placeholder="What is the idea, in one or two sentences?"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canContinue || isSubmitting}
          className="gap-2 rounded-full px-6"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
```

### Hydration (components/program/ProgramMissionHydration.tsx)

```tsx
'use client';

import {
  useEffect,
  useRef,
} from 'react';

import type {
  ProgramMission,
} from '@/lib/program/types';

import type {
  HydrationDomain,
  ProgramHydrationState,
} from '@/lib/program/hydration/types';

import {
  registerJourney,
  applyJourneyHydration,
} from '@/lib/program/journey';

interface ProgramMissionHydrationProps {
  mission: ProgramMission;

  initialHydration:
    ProgramHydrationState;

  hydrationDomains:
    HydrationDomain[];

  children:
    React.ReactNode;
}

export function ProgramMissionHydration({
  mission,
  initialHydration,
  hydrationDomains,
  children,
}: ProgramMissionHydrationProps) {
  const hydratedRef =
    useRef(false);

  useEffect(() => {
    /*
     * The mission layout persists while
     * navigating between mission and quest
     * routes.
     *
     * Therefore we only apply the server
     * hydration payload once for this
     * mounted mission boundary.
     */
    if (hydratedRef.current) {
      return;
    }

    hydratedRef.current = true;

    /*
     * Register the journey boundary.
     *
     * There is no node available at the
     * layout level, so journey registration
     * happens in the shell once the node
     * is known.
     */
    applyJourneyHydration(
      initialHydration,
      hydrationDomains,
    );
  }, [
    initialHydration,
    hydrationDomains,
  ]);

  return (
    <>
      {children}
    </>
  );
}
```



For Quest page we have QuestShell

components/program/ProgramQuestShell.tsx

```tsx
'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter,} from 'next/navigation';
import type { ProgramMission, ProgramNode,} from '@/lib/program/types';
import type { ProgramProgress,} from '@/lib/program/progress';
import { getNodeProgress,} from '@/lib/program/progress';
import { getContainerNodes, getNextDestination, getPreviousNode,} from '@/lib/program/getCurrentNode';
import { loadProgress, saveProgress,} from '@/lib/program/progressStore';
import { buildNodeContext,} from '@/lib/program/context';
import { ProgramNodeRenderer } from './ProgramNodeRenderer';
import {registerJourney,ensureJourneyHydration} from '@/lib/program/journey';

interface ProgramQuestShellProps {
  mission: ProgramMission;
  questId: string;
  initialNode: ProgramNode;
  initialProgress: ProgramProgress;
}

export function ProgramQuestShell({
  mission,
  questId,
  initialNode,
  initialProgress,
}: ProgramQuestShellProps) {
  const router = useRouter();

  const nodes = useMemo(() =>
        getContainerNodes(
          mission,
          'quest',
          questId,
        ),
      [mission,questId],
    );

  const [progress,setProgress] = useState<ProgramProgress>(initialProgress);
  const [currentNode,setCurrentNode] = useState<ProgramNode>(initialNode);
  const completingRef = useRef(false);

  /*
 * Register the current node with
 * the Journey Runtime and ensure
 * the domains required by this journey
 * are hydrated.
 */
useEffect(() => {
  let cancelled = false;

  async function prepareJourney() {
    try {
      registerJourney(
        mission,
        currentNode,
      );

      await ensureJourneyHydration(
        mission,
        currentNode,
      );
    } catch (error) {
      if (cancelled) {
        return;
      }

      console.error(
        '[PROGRAM] Failed to hydrate journey',
        error,
      );
    }
  }

  prepareJourney();

  return () => {
    cancelled = true;
  };
}, [
  mission,
  currentNode,
]);

  /*
   * Restore progress only.
   *
   * The URL/server determines the
   * current node.
   */
  useEffect(() => {
    const stored =
      loadProgress(
        mission.key,
      );

    if (!stored) {
      return;
    }

    setProgress(stored);
  }, [
    mission.key,
  ]);

  /*
   * A new node allows a new completion
   * interaction.
   */
  useEffect(() => {
    completingRef.current =
      false;
  }, [
    currentNode.key,
  ]);

  /*
   * Keep current node aligned with
   * server navigation.
   */
  useEffect(() => {
    setCurrentNode(
      initialNode,
    );
  }, [
    initialNode,
  ]);

  const currentIndex =
    nodes.findIndex(
      (node) =>
        node.key ===
        currentNode.key,
    );

  const nodeProgress =
    getNodeProgress(
      progress,
      currentNode,
    );

  /*
   * Build node-specific context
   * from already hydrated stores.
   */
  const context =
    buildNodeContext(
      currentNode,
    );

  function updateProgress(
    next: ProgramProgress,
  ) {
    setProgress(next);
    saveProgress(next);
  }

  async function handleComplete(
    result?: Record<string, unknown>,
  ) {
    if (
      completingRef.current
    ) {
      return;
    }

    completingRef.current =
      true;

    const nodeKey =
      currentNode.key;

    const now =
      new Date().toISOString();

    const existing =
      progress.nodes[
        nodeKey
      ];

    const completedNodeKeys =
      progress.completedNodeKeys.includes(
        nodeKey,
      )
        ? progress.completedNodeKeys
        : [
            ...progress.completedNodeKeys,
            nodeKey,
          ];

    const progressAfterCompletion:
      ProgramProgress = {
        ...progress,

        completedNodeKeys,

        nodes: {
          ...progress.nodes,

          [nodeKey]: {
            nodeKey,

            status:
              'completed',

            startedAt:
              existing?.startedAt ??
              now,

            completedAt:
              now,

            payload:
              result ??
              existing?.payload ??
              {},

            aiData:
              existing?.aiData,
          },
        },

        updatedAt:
          now,
      };

    const destination =
      getNextDestination(
        mission,
        nodeKey,
        progressAfterCompletion,
      );

    const nextCurrentNodeKey =
      destination.type ===
      'complete'
        ? undefined
        : destination.nodeKey;

    const nextProgress:
      ProgramProgress = {
        ...progressAfterCompletion,

        currentNodeKey:
          nextCurrentNodeKey,

        updatedAt:
          now,
      };

    updateProgress(
      nextProgress,
    );

    /*
     * Quest/mission journey complete.
     */
    if (
      destination.type ===
      'complete'
    ) {
      router.push(
        `/program/mission/${mission.key}`,
      );

      return;
    }

    /*
     * Next node is a mission-level node.
     */
    if (
      destination.type ===
      'mission'
    ) {
      router.push(
        `/program/mission/${destination.missionId}?node=${destination.nodeKey}`,
      );

      return;
    }

    /*
     * Next node is another quest.
     */
    router.push(
      `/program/mission/${destination.missionId}/quest/${destination.questId}?node=${destination.nodeKey}`,
    );
  }

  function handleBack() {
    if (
      completingRef.current
    ) {
      return;
    }

    const previous =
      getPreviousNode(
        mission,
        currentNode.key,
      );

    if (!previous) {
      return;
    }

    /*
     * If previous node is a mission node,
     * navigate back to mission container.
     */
    if (
      previous.container.type ===
      'mission'
    ) {
      router.push(
        `/program/mission/${mission.key}?node=${previous.key}`,
      );

      return;
    }

    /*
     * Previous node belongs to a quest.
     */
    if (
      previous.container.type ===
        'quest' &&
      previous.container.key ===
        questId
    ) {
      setCurrentNode(
        previous,
      );

      return;
    }

    /*
     * Previous node belongs to a
     * different quest.
     */
    router.push(
      `/program/mission/${mission.key}/quest/${previous.container.key}?node=${previous.key}`,
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mission {mission.sequence}
          </span>

          <span>
            Step {currentIndex + 1}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${
                nodes.length > 0
                  ? ((currentIndex + 1) /
                      nodes.length) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <ProgramNodeRenderer
        node={currentNode}
        context={context}
        progress={nodeProgress}
        onComplete={
          handleComplete
        }
      />

      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
      )}

      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Development state
        </summary>

        <pre className="mt-4 overflow-auto text-xs">
          {JSON.stringify(
            {
              mission:
                mission.key,

              quest:
                questId,

              currentNode:
                currentNode.key,

              completed:
                progress.completedNodeKeys,

              journey:
                'registered',

              context:
                Object.keys(
                  context,
                ),
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}
```



Let me know if you need to refer to any other files i will attach them.
