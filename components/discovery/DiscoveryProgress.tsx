interface DiscoveryProgressProps {
  current: number;
  total: number;
}

export function DiscoveryProgress({
  current,
  total,
}: DiscoveryProgressProps) {
  const percentage =
    total === 0
      ? 0
      : (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current} of {total}
        </span>

        <span>
          A few minutes
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}