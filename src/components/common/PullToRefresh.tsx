import { type ReactNode, useRef, useState, useCallback } from 'react';
import { HiRefresh } from 'react-icons/hi';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

const THRESHOLD = 80;

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || refreshing) return;
      const container = containerRef.current;
      if (container && container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    },
    [disabled, refreshing],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || refreshing || startY.current === 0) return;
      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      const distance = Math.max(0, (e.touches[0].clientY - startY.current) * 0.5);
      setPullDistance(Math.min(distance, THRESHOLD * 1.5));
    },
    [disabled, refreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || refreshing) return;

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    startY.current = 0;
  }, [disabled, refreshing, pullDistance, onRefresh]);

  const isVisible = pullDistance > 0 || refreshing;

  return (
    <div className="pull-refresh">
      <div
        className={`pull-refresh__indicator ${isVisible ? 'pull-refresh__indicator--visible' : ''}`}
        style={{ transform: `translateY(${refreshing ? 0 : pullDistance - THRESHOLD}px)` }}
      >
        <HiRefresh size={24} />
      </div>
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
