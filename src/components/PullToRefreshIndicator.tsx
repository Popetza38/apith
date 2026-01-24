// ============================================
// Pull to Refresh Indicator Component
// ============================================
// Visual indicator untuk pull-to-refresh gesture

"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshIndicatorProps {
  progress: number;
  isRefreshing: boolean;
  pullDistance: number;
}

export function PullToRefreshIndicator({
  progress,
  isRefreshing,
  pullDistance
}: PullToRefreshIndicatorProps) {
  const threshold = 80;

  // Calculate rotation based on progress
  const rotation = progress * 360;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 flex justify-center pointer-events-none md:hidden"
      style={{
        transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
        opacity: progress > 0 ? 1 : 0,
      }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          "bg-primary/10 backdrop-blur-sm",
          isRefreshing && "bg-primary/20"
        )}
      >
        {isRefreshing ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-primary transition-transform duration-75"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <path
              fill="currentColor"
              d="M12 4V1L8 5l4 3V4zm0 2v5c0 3.87 3.13 7 7 7s7-3.13 7-7V8h-2v3c0 2.76-2.24 5-5 5s-5-2.24-5-5V8H5v3c0 3.87 3.13 7 7 7s7-3.13 7-7V8h-2z"
              opacity={progress < 1 ? 0.3 : 1}
            />
          </svg>
        )}
      </div>
      {progress >= 1 && !isRefreshing && (
        <span className="absolute top-full mt-2 text-xs text-muted-foreground">
          Lepaskan untuk refresh
        </span>
      )}
    </div>
  );
}
