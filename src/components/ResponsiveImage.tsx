// ============================================
// Responsive Image Component
// ============================================
// Component gambar yang responsive dengan loading skeleton dan optimization

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ResponsiveImage({
  src,
  alt,
  width = 400,
  height = 600,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading Skeleton */}
      {(isLoading || hasError) && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            hasError && "bg-muted/30"
          )}
          style={{
            background: hasError
              ? undefined
              : "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
            backgroundSize: hasError ? undefined : "200% 100%"
          }}
        >
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-muted-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828-2.828L16 16m-2-2l1.586-1.586a2 2 0 012.828-2.828l4.586-4.586m-6 6l.586.586a2 2 0 012.828 0L16 16m-2-2l2 2m-2-2l4.586-4.586a2 2 0 012.828-2.828L16 16"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          "transition-opacity duration-300 object-cover",
          isLoading && "opacity-0",
          hasError && "hidden"
        )}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        priority={priority}
        fill={!width && !height}
      />
    </div>
  );
}
