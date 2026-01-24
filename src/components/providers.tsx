"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { SupportedLanguage } from "@/types/language";
import { useState, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FEATURES } from "@/lib/constants";

interface ProvidersProps {
  children: React.ReactNode;
  language?: SupportedLanguage;
}

export function Providers({ children, language = 'th' }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default
            gcTime: 1000 * 60 * 30, // 30 minutes cache
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider initialLanguage={language}>
          <TooltipProvider>{children}</TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
      {/* Vercel Analytics & Speed Insights - wrapped in Suspense for performance */}
      <Suspense fallback={null}>
        {FEATURES.VERCEL_ANALYTICS && <Analytics />}
        {FEATURES.SPEED_INSIGHTS && <SpeedInsights />}
      </Suspense>
    </QueryClientProvider>
  );
}
