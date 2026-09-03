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