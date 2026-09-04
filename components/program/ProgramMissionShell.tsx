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

import type { ProgramProgress } from '@/lib/program/progress';
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

interface ProgramMissionShellProps {
  mission: ProgramMission;
  initialNode: ProgramNode;
  initialProgress: ProgramProgress;
}

export function ProgramMissionShell({
  mission,
  initialNode,
  initialProgress,
}: ProgramMissionShellProps) {
  const router = useRouter();

  const nodes = useMemo(
    () =>
      getContainerNodes(
        mission,
        'mission',
        mission.key,
      ),
    [mission],
  );

  const [progress, setProgress] =
    useState<ProgramProgress>(
      initialProgress,
    );

  const [currentNode, setCurrentNode] =
    useState<ProgramNode>(
      initialNode,
    );

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
      /*
       * Mission finished.
       *
       * We leave the mission page in
       * place for now. The final decision
       * component can eventually control
       * what happens after completion.
       */
      return;
    }

    if (
      destination.type ===
      'mission'
    ) {
      setCurrentNode(
        mission.nodes.find(
          (node) =>
            node.key ===
            destination.nodeKey,
        )!,
      );

      return;
    }

    /*
     * Mission node → Quest.
     */
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

    if (
      previous.container.type !==
      'mission'
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
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}