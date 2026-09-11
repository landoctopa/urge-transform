'use client';

import type {
  DiscoveryHurdle as DiscoveryHurdleType,
  DiscoveryOption,
} from '@/lib/discovery/types';

interface DiscoveryHurdleProps {
  options: DiscoveryOption<DiscoveryHurdleType>[];
  value: DiscoveryHurdleType | null;
  onSelect: (
    value: DiscoveryHurdleType,
  ) => void;
}

export function DiscoveryHurdle({
  options,
  value,
  onSelect,
}: DiscoveryHurdleProps) {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          One more thing
        </p>

        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">
          What is most likely to stop you?
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Be honest. The point isn't to sound ready. It's to figure out what
          would actually help.
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
                'group flex w-full items-center gap-5 border px-5 py-5 text-left transition-all duration-300',
                'hover:-translate-y-0.5 hover:border-foreground/40',
                selected
                  ? 'border-primary bg-primary/[0.04]'
                  : 'border-border bg-background',
              ].join(' ')}
            >
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(
                  2,
                  '0',
                )}
              </span>

              <span className="text-base font-medium tracking-[-0.015em] sm:text-lg">
                {option.title}
              </span>

              <span
                className={[
                  'ml-auto h-2 w-2 shrink-0 rounded-full transition-all duration-300',
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