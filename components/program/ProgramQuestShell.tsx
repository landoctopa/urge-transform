
'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import type {
  ProgramProgress,
} from '@/lib/program/progress';

import {
  getNodeProgress,
} from '@/lib/program/progress';

import {
  getContainerNodes,
  getNextDestination,
  getPreviousNode,
} from '@/lib/program/getCurrentNode';

import {
  loadProgress,
  saveProgress,
} from '@/lib/program/progressStore';

import { ProgramNodeRenderer } from './ProgramNodeRenderer';

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

  /*
   * All nodes belonging to this quest.
   */
  const nodes = useMemo(
    () =>
      getContainerNodes(
        mission,
        'quest',
        questId,
      ),
    [mission, questId],
  );

  /*
   * Progress is persisted state.
   *
   * The URL / server determines which node
   * we initially render.
   *
   * localStorage only restores progress.
   */
  const [progress, setProgress] =
    useState<ProgramProgress>(
      initialProgress,
    );

  /*
   * The node currently being displayed.
   *
   * For now this is initialized from the
   * server/page. Navigation between nodes
   * happens explicitly through router.push()
   * or local state for Back.
   */
  const [currentNode, setCurrentNode] =
    useState<ProgramNode>(
      initialNode,
    );

  /*
   * Prevent accidental double submission /
   * repeated onComplete calls while a
   * transition is in progress.
   */
  const completingRef =
    useRef(false);

  /*
   * Restore persisted client-side progress.
   *
   * IMPORTANT:
   *
   * We deliberately do NOT restore
   * currentNode from localStorage here.
   *
   * The page/URL is authoritative about
   * which node should currently be shown.
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
  }, [mission.key]);

  /*
   * A new node means a new completion
   * interaction can begin.
   */
  useEffect(() => {
    completingRef.current =
      false;
  }, [currentNode.key]);

  /*
   * Keep the rendered node aligned with
   * a new initialNode when the route/page
   * changes without a full component
   * remount.
   */
  useEffect(() => {
    setCurrentNode(
      initialNode,
    );
  }, [initialNode]);

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

  function updateProgress(
    next: ProgramProgress,
  ) {
    setProgress(next);
    saveProgress(next);
  }

  async function handleComplete(
    result?: Record<string, unknown>,
  ) {
    /*
     * Defensive guard against:
     *
     * - double clicks
     * - components accidentally calling
     *   onComplete more than once
     * - development-mode repeated events
     */
    if (completingRef.current) {
      return;
    }

    completingRef.current = true;

    const nodeKey =
      currentNode.key;

    const now =
      new Date().toISOString();

    const existing =
      progress.nodes[nodeKey];

    /*
     * First mark the current node as
     * completed.
     */
    const completedNodeKeys =
      progress.completedNodeKeys.includes(
        nodeKey,
      )
        ? progress.completedNodeKeys
        : [
            ...progress.completedNodeKeys,
            nodeKey,
          ];

    /*
     * Temporarily create the progress
     * state containing the completed node.
     *
     * We need this state when calculating
     * the next destination because the next
     * node may depend on the node we just
     * completed.
     */
    const progressAfterCompletion: ProgramProgress =
      {
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

        updatedAt: now,
      };

    /*
     * Determine where the journey should
     * go next using the newly completed
     * state.
     */
    const destination =
      getNextDestination(
        mission,
        nodeKey,
        progressAfterCompletion,
      );

    console.log(
      '[PROGRAM TRANSITION]',
      {
        currentNode:
          nodeKey,
        completed:
          progressAfterCompletion
            .completedNodeKeys,
        destination,
      },
    );

    /*
     * currentNodeKey means:
     *
     * "the node the user is currently
     * working on"
     *
     * rather than:
     *
     * "the last node completed".
     */
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

        updatedAt: now,
      };

    /*
     * Persist before navigation.
     *
     * This means that if the user refreshes
     * immediately after navigation, the
     * completed state already exists.
     */
    updateProgress(
      nextProgress,
    );

    /*
     * Mission is complete.
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
     * Destination is a mission-level node.
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
     * Destination is another quest node.
     */
    router.push(
      `/program/mission/${destination.missionId}/quest/${destination.questId}?node=${destination.nodeKey}`,
    );
  }

  function handleBack() {
    /*
     * Don't allow Back while a completion
     * transition is underway.
     */
    if (completingRef.current) {
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
     * Only allow back navigation within
     * the current quest.
     *
     * We don't want the Quest Shell
     * suddenly taking the user to a
     * mission-level node or another quest.
     */
    if (
      previous.container.type !==
        'quest' ||
      previous.container.key !==
        questId
    ) {
      return;
    }

    setCurrentNode(
      previous,
    );
  }

  /*
   * Defensive handling in case the node
   * somehow isn't part of the quest.
   */
  if (
    nodes.length === 0 ||
    currentIndex === -1
  ) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          This quest node could not be
          found.
        </p>
      </div>
    );
  }

  const progressPercent =
    ((currentIndex + 1) /
      nodes.length) *
    100;

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentIndex + 1} of{' '}
            {nodes.length}
          </span>

          <span>
            {Math.round(
              progressPercent,
            )}
            %
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Current node */}
      <ProgramNodeRenderer
        node={currentNode}
        context={{}}
        progress={nodeProgress}
        onComplete={
          handleComplete
        }
      />

      {/* Back */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handleBack}
          disabled={
            completingRef.current
          }
          className="text-sm text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          ← Back
        </button>
      )}

      {/* Development state */}
      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Development state
        </summary>

        <pre className="mt-4 overflow-auto text-xs">
          {JSON.stringify(
            {
              currentNode:
                currentNode.key,

              currentNodeIndex:
                currentIndex,

              completed:
                progress.completedNodeKeys,

              currentNodeProgress:
                progress.nodes[
                  currentNode.key
                ] ?? null,

              destination:
                getNextDestination(
                  mission,
                  currentNode.key,
                  progress,
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

