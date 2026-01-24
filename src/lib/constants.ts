/**
 * ===========================================
 * API Configuration
 * ===========================================
 * Centralized API settings - no need for environment variables
 */
export const API_CONFIG = {
  /** Upstream API base URL */
  UPSTREAM_API: "https://api.megawe.net",
  /** Default language for API requests */
  DEFAULT_LANGUAGE: "th",
} as const;

/**
 * ===========================================
 * Feature Flags
 * ===========================================
 * Easy toggle for optional features
 * Set to false to disable specific features
 */
export const FEATURES = {
  /** Vercel Web Analytics - tracks page views and custom events */
  VERCEL_ANALYTICS: true,
  /** Vercel Speed Insights - monitors Web Vitals (LCP, FID, CLS, etc.) */
  SPEED_INSIGHTS: true,
} as const;

/**
 * ===========================================
 * Cache Duration Constants (in seconds)
 * ===========================================
 * Centralized cache configuration for ISR and API routes
 */
export const CACHE_DURATION = {
  /** 4 minutes - Search results (highly dynamic) */
  SEARCH: 240,
  /** 5 minutes - Episode lists */
  EPISODES: 300,
  /** 10 minutes - Drama lists, details, trends */
  DRAMA_LIST: 600,
  /** 15 minutes - Static content */
  STATIC: 900,
  /** 1 hour - Home page and main pages */
  HOME: 3600,
} as const;

/**
 * React Query stale time constants (in milliseconds)
 */
export const STALE_TIME = {
  /** 1 minute - Default stale time */
  DEFAULT: 60 * 1000,
  /** 5 minutes - Drama lists */
  DRAMA_LIST: 1000 * 60 * 5,
  /** 30 minutes - Cached data */
  LONG_CACHE: 1000 * 60 * 30,
} as const;

/**
 * React Query garbage collection time (in milliseconds)
 * How long to keep unused data in cache
 */
export const GC_TIME = {
  /** 30 minutes - Default GC time */
  DEFAULT: 1000 * 60 * 30,
  /** 1 hour - Long cache */
  LONG: 1000 * 60 * 60,
} as const;

/**
 * API response status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 12,
  /** Maximum items per page */
  MAX_PAGE_SIZE: 50,
} as const;

/**
 * Image optimization constants
 */
export const IMAGE = {
  /** Default image width */
  DEFAULT_WIDTH: 300,
  /** Default image height */
  DEFAULT_HEIGHT: 400,
  /** Image quality (1-100) */
  QUALITY: 85,
  /** Lazy load threshold (pixels) */
  LAZY_THRESHOLD: 200,
} as const;

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
  /** Fast transition */
  FAST: 150,
  /** Default transition */
  DEFAULT: 300,
  /** Slow transition */
  SLOW: 500,
} as const;

/**
 * Screen size breakpoints (in pixels)
 */
export const BREAKPOINT = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Type guard for cache duration
 */
export function isValidCacheDuration(value: number): value is typeof CACHE_DURATION[keyof typeof CACHE_DURATION] {
  return Object.values(CACHE_DURATION).includes(value as typeof CACHE_DURATION[keyof typeof CACHE_DURATION]);
}

/**
 * Format seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}
