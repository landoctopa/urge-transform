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