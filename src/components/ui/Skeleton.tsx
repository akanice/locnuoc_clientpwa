const variantClasses = {
  text: 'h-3.5 mb-2 last:w-[60%]',
  title: 'h-5 w-[40%] mb-3',
  avatar: 'size-12 rounded-full',
  card: 'h-[120px] rounded-2xl mb-3',
  stat: 'h-20 rounded-2xl',
};

interface SkeletonProps {
  variant?: keyof typeof variantClasses;
  count?: number;
}

export function Skeleton({ variant = 'text', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton-shimmer rounded-lg ${variantClasses[variant]}`} />
      ))}
    </>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-[120px] rounded-2xl" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-4">
      <Skeleton variant="title" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
        <Skeleton variant="stat" />
      </div>
      <SkeletonList count={4} />
    </div>
  );
}
