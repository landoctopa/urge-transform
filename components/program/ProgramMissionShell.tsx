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

interface ProgramMissionShellProps {
  mission: ProgramMission;
  initialNode: ProgramNode;
}

export function ProgramMissionShell({
  mission,
  initialNode,
}: ProgramMissionShellProps) {
  const router = useRouter();

  const missionNodes = useMemo(
    () =>
      getContainerNodes(
        mission,
        'mission',
        mission.key,
      ),
    [mission],
  );

  const [currentNode, setCurrentNode] =
    useState<ProgramNode>(initialNode);

  const [completedNodeKeys, setCompletedNodeKeys] =
    useState<string[]>([]);

  const [payloadByNode, setPayloadByNode] =
    useState<Record<string, Record<string, unknown>>>({});

  const currentIndex = missionNodes.findIndex(
    (node) => node.key === currentNode.key,
  );

  async function handleComplete(
    result?: Record<string, unknown>,
  ) {
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

    /*
     * Mission nodes do not necessarily lead to
     * another mission node.
     *
     * A mission node can hand the user into a quest.
     *
     * That transition is defined by the mission
     * structure rather than by the component.
     */

    const nextNode = getNextNode(
      mission,
      'mission',
      mission.key,
      currentNode.key,
    );

    if (nextNode) {
      setCurrentNode(nextNode);
      return;
    }

    /*
     * No more mission-level nodes.
     *
     * For the first prototype we return to the
     * mission overview.
     *
     * Later this will handle the complete mission
     * state / final decision.
     */

    router.push(
      `/program/mission/${mission.key}`,
    );
  }

  function handleBack() {
    const previousNode = getPreviousNode(
      mission,
      'mission',
      mission.key,
      currentNode.key,
    );

    if (previousNode) {
      setCurrentNode(previousNode);
    }
  }

  /*
   * Find the first quest that follows the current
   * mission node.
   *
   * This is useful for showing the transition point
   * in the mission UI.
   */
  const nextQuest = useMemo(() => {
    if (currentIndex < 0) {
      return null;
    }

    /*
     * For now quests are ordered by their sequence.
     * We will make the exact mission orchestration
     * explicit in the playbook once we wire the
     * complete Mission 1 flow.
     */
    return (
      mission.quests?.find(
        (quest) => quest.sequence === currentIndex + 1,
      ) ?? null
    );
  }, [
    mission.quests,
    currentIndex,
  ]);

  const progressPercent =
    missionNodes.length > 0
      ? ((currentIndex + 1) /
          missionNodes.length) *
        100
      : 0;

  return (
    <div className="space-y-8">

      {/* Mission progress */}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mission {mission.sequence}
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

      {/* Current mission node */}

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

      {/* Optional quest transition */}

      {nextQuest && (
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Coming next
          </p>

          <p className="mt-1 font-medium">
            Quest {nextQuest.sequence}: {nextQuest.title}
          </p>
        </div>
      )}

      {/* Back */}

      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-muted-foreground hover:text-foreground"
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
              currentNode: currentNode.key,
              completedNodeKeys,
              payloadByNode,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}