import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchDramasServer, fetchTrendingServer, fetchLatestServer } from "@/lib/server-fetch";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage, tServer } from "@/lib/i18n";
import { HeroSection } from "@/components/HeroSection";
import { ForYouDramas } from "@/components/ForYouDramas";
import { TrendingDramas } from "@/components/TrendingDramas";
import { LatestDramas } from "@/components/LatestDramas";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

export const revalidate = 3600; // ISR every 1 hour

interface LangPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for home page
 */
export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const siteTitle = await tServer(language, "seo.siteTitle");
  const siteDescription = await tServer(language, "seo.siteDescription");

  return {
    title: siteTitle,
    description: siteDescription,
  };
}

export default async function LangHomePage({ params }: LangPageProps) {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language
  if (!isSupportedLanguage(language)) {
    notFound();
  }

  // Get translations
  const forYouTitle = await tServer(language, "home.forYou");
  const forYouDesc = await tServer(language, "home.forYouDescription");
  const trendingTitle = await tServer(language, "home.trending");
  const trendingDesc = await tServer(language, "home.trendingDescription");
  const latestTitle = await tServer(language, "nav.latest");
  const latestDesc = await tServer(language, "home.latestDescription");

  const queryClient = new QueryClient();

  // Prefetch all data in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["dramas", "foryou", language],
      queryFn: () => fetchDramasServer(language),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dramas", "trending", language],
      queryFn: () => fetchTrendingServer(language),
    }),
    queryClient.prefetchQuery({
      queryKey: ["dramas", "latest", language],
      queryFn: () => fetchLatestServer(language),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen">
        {/* For You Section */}
        <HeroSection
          title={forYouTitle}
          description={forYouDesc}
          icon="sparkles"
          lang={language}
        />
        <div className="container mx-auto px-4 pb-12">
          <ForYouDramas lang={language} />
        </div>

        {/* Trending Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  {trendingTitle}
                </h2>
                <p className="text-muted-foreground text-sm">{trendingDesc}</p>
              </div>
            </div>
            <TrendingDramas lang={language} />
          </div>
        </section>

        {/* Latest Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  {latestTitle}
                </h2>
                <p className="text-muted-foreground text-sm">{latestDesc}</p>
              </div>
            </div>
            <LatestDramas lang={language} />
          </div>
        </section>
      </main>
    </HydrationBoundary>
  );
}
