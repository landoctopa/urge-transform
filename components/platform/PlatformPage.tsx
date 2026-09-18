import type {
  ReactNode,
} from 'react';

type PlatformPageSize =
  | 'narrow'
  | 'standard'
  | 'wide';

interface PlatformPageProps {
  children: ReactNode;
  size?: PlatformPageSize;
  className?: string;
}

const SIZE_CLASSES: Record<
  PlatformPageSize,
  string
> = {
  narrow: 'max-w-2xl',
  standard: 'max-w-6xl',
  wide: 'max-w-7xl',
};

export function PlatformPage({
  children,
  size = 'standard',
  className,
}: PlatformPageProps) {
  return (
    <div
      className={[
        'mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12',
        SIZE_CLASSES[size],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}