'use client';

import type {
  DiscoveryOption,
  DiscoverySituation as DiscoverySituationType,
} from '@/lib/discovery/types';

interface DiscoverySituationProps {
  options: DiscoveryOption<DiscoverySituationType>[];
  value: DiscoverySituationType | null;
  onSelect: (
    value: DiscoverySituationType,
  ) => void;
}

export function DiscoverySituation({
  options,
  value,
  onSelect,
}: DiscoverySituationProps) {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          Start here
        </p>

        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">
          Which sounds most like you?
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          There is no right answer. We just want to understand where you are
          starting from.
        </p>
      </div>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const selected =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onSelect(option.value)
              }
              className={[
                'group flex w-full items-start gap-5 border px-5 py-5 text-left transition-all duration-300',
                'hover:-translate-y-0.5 hover:border-foreground/40',
                selected
                  ? 'border-primary bg-primary/[0.04]'
                  : 'border-border bg-background',
              ].join(' ')}
            >
              <span className="mt-0.5 text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(
                  2,
                  '0',
                )}
              </span>

              <span className="min-w-0">
                <span className="block text-base font-medium tracking-[-0.015em] sm:text-lg">
                  {option.title}
                </span>

                {option.description && (
                  <span className="mt-1 block max-w-xl text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>

              <span
                className={[
                  'ml-auto mt-1 h-2 w-2 shrink-0 rounded-full transition-all duration-300',
                  selected
                    ? 'bg-primary'
                    : 'bg-border group-hover:bg-foreground/40',
                ].join(' ')}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}