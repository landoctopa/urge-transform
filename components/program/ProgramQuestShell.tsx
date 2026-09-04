'use client';

import {
  useEffect,
  useMemo,
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
import { getNodeProgress } from '@/lib/program/progress';

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

  const nodes = useMemo(
    () =>
      getContainerNodes(
        mission,
        'quest',
        questId,
      ),
    [mission, questId],
  );

  const [progress, setProgress] =
    useState<ProgramProgress>(
      initialProgress,
    );

  const [currentNode, setCurrentNode] =
    useState<ProgramNode>(
      initialNode,
    );

  /*
   * Restore client-side progress.
   *
   * The server gives us a valid initial
   * node; localStorage lets us resume.
   */
  useEffect(() => {
    const stored = loadProgress(
      mission.key,
    );

    if (!stored) {
      return;
    }

    setProgress(stored);

    if (stored.currentNodeKey) {
      const storedNode =
        nodes.find(
          (node) =>
            node.key ===
            stored.currentNodeKey,
        );

      if (storedNode) {
        setCurrentNode(
          storedNode,
        );
      }
    }
  }, [mission.key, nodes]);

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
    const now =
      new Date().toISOString();

    const existing =
      progress.nodes[
      currentNode.key
      ];

    const nextProgress: ProgramProgress = {
      ...progress,

      currentNodeKey:
        currentNode.key,

      completedNodeKeys:
        progress.completedNodeKeys.includes(
          currentNode.key,
        )
          ? progress.completedNodeKeys
          : [
            ...progress.completedNodeKeys,
            currentNode.key,
          ],

      nodes: {
        ...progress.nodes,

        [currentNode.key]: {
          nodeKey:
            currentNode.key,

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

    updateProgress(
      nextProgress,
    );

    /*
     * Determine the next destination
     * using the actual mission journey.
     */
    const destination =
      getNextDestination(
        mission,
        currentNode.key,
        nextProgress,
      );

    if (
      destination.type ===
      'complete'
    ) {
      router.push(
        `/program/mission/${mission.key}`,
      );

      return;
    }

    if (
      destination.type ===
      'mission'
    ) {
      router.push(
        `/program/mission/${destination.missionId}?node=${destination.nodeKey}`,
      );

      return;
    }

    router.push(
      `/program/mission/${destination.missionId}/quest/${destination.questId}?node=${destination.nodeKey}`,
    );
  }

  function handleBack() {
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
     * We don't want a Quest page suddenly
     * taking the user back into a mission
     * node or previous quest.
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentIndex + 1} of{' '}
            {nodes.length}
          </span>

          <span>
            {Math.round(
              ((currentIndex + 1) /
                nodes.length) *
              100,
            )}
            %
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${((currentIndex + 1) /
                  nodes.length) *
                100
                }%`,
            }}
          />
        </div>
      </div>

      <ProgramNodeRenderer
        node={currentNode}
        context={{}}
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
              currentNode:
                currentNode.key,
              completed:
                progress.completedNodeKeys,
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