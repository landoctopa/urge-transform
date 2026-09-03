'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type {
  ProgramMission,
  ProgramNode,
} from '@/lib/program/types';

import {
  getContainerNodes,
  getNextNode,
  getPreviousNode,
} from '@/lib/program/getCurrentNode';

import { ProgramNodeRenderer } from './ProgramNodeRenderer';

interface ProgramQuestShellProps {
  mission: ProgramMission;
  questId: string;
  initialNode: ProgramNode;
}

export function ProgramQuestShell({
  mission,
  questId,
  initialNode,
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

  const [currentNode, setCurrentNode] =
    useState<ProgramNode>(initialNode);

  const [completedNodeKeys, setCompletedNodeKeys] =
    useState<string[]>([]);

  const [payloadByNode, setPayloadByNode] =
    useState<Record<string, Record<string, unknown>>>({});

  const currentIndex = nodes.findIndex(
    (node) => node.key === currentNode.key,
  );

  const isFirstNode = currentIndex <= 0;
  const isLastNode =
    currentIndex === nodes.length - 1;

  const progressPercent =
    nodes.length > 0
      ? ((currentIndex + 1) / nodes.length) * 100
      : 0;

  async function handleComplete(
    result?: Record<string, unknown>,
  ) {
    /*
     * For now this is local state only.
     *
     * Later this becomes:
     *
     *   1. save node result
     *   2. save domain data if required
     *   3. write user_progress
     *   4. write ai_logs if applicable
     *   5. resolve next node
     */

    setCompletedNodeKeys((current) =>
      current.includes(currentNode.key)
        ? current
        : [...current, currentNode.key],
    );

    if (result) {
      setPayloadByNode((current) => ({
        ...current,
        [currentNode.key]: result,
      }));
    }

    const nextNode = getNextNode(
      mission,
      'quest',
      questId,
      currentNode.key,
    );

    if (nextNode) {
      setCurrentNode(nextNode);
      return;
    }

    /*
     * Quest is complete.
     *
     * For now return to the mission page.
     * Later this will also persist quest completion.
     */
    router.push(
      `/program/mission/${mission.key}`,
    );
  }

  function handleBack() {
    const previousNode = getPreviousNode(
      mission,
      'quest',
      questId,
      currentNode.key,
    );

    if (previousNode) {
      setCurrentNode(previousNode);
    }
  }

  return (
    <div className="space-y-8">

      {/* Quest progress */}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentIndex + 1} of {nodes.length}
          </span>

          <span>
            {Math.round(progressPercent)}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
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
        progress={{
          status: completedNodeKeys.includes(
            currentNode.key,
          )
            ? 'completed'
            : 'in_progress',

          payload:
            payloadByNode[currentNode.key] ?? {},
        }}
        onComplete={handleComplete}
      />

      {/* Navigation */}

      {!isFirstNode && (
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Debug information — remove later */}

      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Development state
        </summary>

        <pre className="mt-4 overflow-auto text-xs">
          {JSON.stringify(
            {
              currentNode: currentNode.key,
              completedNodeKeys,
              payloadByNode,
              isLastNode,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}