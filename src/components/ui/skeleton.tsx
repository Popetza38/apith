import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };

// ============================================
// DramaBox Specific Skeletons
// ============================================

export function DramaCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      {/* Cover Image Skeleton */}
      <Skeleton className="aspect-[3/4] w-full" />

      <div className="p-3 space-y-2">
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4" />

        {/* Meta Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/6" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function EpisodeListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
        >
          <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <DramaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : i === lines - 2 ? "w-5/6" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
