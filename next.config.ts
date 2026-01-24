import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // ===========================================
  // Image Optimization for Vercel
  // ===========================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgcdnmi.dramaboxdb.com",
      },
      {
        protocol: "https",
        hostname: "hwztchapter.dramaboxdb.com",
      },
    ],
    // Enable Vercel's Image Optimization
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ===========================================
  // Compiler Options for Vercel Edge
  // ===========================================
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ===========================================
  // Experimental Features for Vercel
  // ===========================================
  experimental: {
    // Optimize CSS extraction for Vercel Edge
    // Disabled: requires critters package which may cause issues
    // optimizeCss: true,
    // Enable optimized package imports
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "lucide-react",
    ],
  },

  // ===========================================
  // Vercel Edge Runtime Configuration
  // ===========================================

  // Security headers and Cache Control
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Cache-Control",
            value: "s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // Aggressive caching for static assets (images, fonts)
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).(jpg|jpeg|png|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).(woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirect root to default language
  async redirects() {
    return [
      {
        source: "/",
        destination: "/th",
        permanent: false,
      },
    ];
  },

  // ===========================================
  // Turbopack Configuration
  // ===========================================
  turbopack: {
    // Turbopack handles most optimizations automatically
    // No additional config needed for basic usage
  },

  // ===========================================
  // Compression for Vercel
  // ===========================================
  compress: true,

  // ===========================================
  // Power-by header for monitoring
  // ===========================================
  poweredByHeader: false,

  // ===========================================
  // Generate ETags for caching
  // ===========================================
  generateEtags: true,

  // ===========================================
  // Production source maps (disabled for smaller bundles)
  // ===========================================
  productionBrowserSourceMaps: false,

  // ===========================================
  // Optimize output for Vercel Edge
  // ===========================================
  output: "standalone",

  // ===========================================
  // Logging configuration
  // ===========================================
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer(nextConfig);
