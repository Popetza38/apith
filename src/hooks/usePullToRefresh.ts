// ============================================
// Pull to Refresh Hook
// ============================================
// Hook untuk implementasi pull-to-refresh gesture pada mobile

import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  disabled = false
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger when at the top of the page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Apply resistance for better feel (harder to pull further down)
      const distance = deltaY > 0
        ? deltaY / resistance
        : deltaY;

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      // Trigger refresh if threshold passed
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      // Reset state
      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
      currentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, onRefresh, disabled, isRefreshing]);

  // Calculate progress (0 to 1)
  const progress = Math.min(pullDistance / threshold, 1);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    progress
  };
}
