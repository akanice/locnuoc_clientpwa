interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'stat';
  count?: number;
}

export function Skeleton({ variant = 'text', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton--${variant}`} />
      ))}
    </>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="app-shell__content">
      <Skeleton variant="title" />
      <div className="stat-grid">
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
      </div>
      <SkeletonList count={4} />
    </div>
  );
}
