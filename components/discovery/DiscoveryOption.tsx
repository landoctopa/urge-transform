'use client';

interface DiscoveryOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  multiple?: boolean;
}

export function DiscoveryOption({
  label,
  description,
  selected,
  onClick,
  multiple = false,
}: DiscoveryOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full rounded-2xl border p-5 text-left transition',
        'hover:border-primary/50 hover:bg-primary/5',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
            multiple
              ? 'rounded-md'
              : 'rounded-full',
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/40',
          ].join(' ')}
        >
          {selected && (
            <span className="text-xs font-bold">
              ✓
            </span>
          )}
        </span>

        <span className="space-y-1">
          <span className="block font-medium">
            {label}
          </span>

          {description && (
            <span className="block text-sm leading-6 text-muted-foreground">
              {description}
            </span>
          )}
        </span>
      </div>
    </button>
  );
}