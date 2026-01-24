import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";
import { HeroSection } from "@/components/HeroSection";
import { TrendingDramas } from "@/components/TrendingDramas";

export const revalidate = 3600; // ISR every 1 hour

interface TerpopulerPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Terpopuler page
 */
export async function generateMetadata({ params }: TerpopulerPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  return {
    title: language === 'in' ? 'Terpopuler - DramaBox' : `Popular - DramaBox`,
    description: language === 'in'
      ? 'Drama-drama paling populer yang sedang ditonton banyak orang!'
      : 'The most popular dramas being watched by many people!',
  };
}

export default async function TerpopulerPage({ params }: TerpopulerPageProps) {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language
  if (!isSupportedLanguage(language)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="relative pt-24 pb-8 md:pt-28 md:pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-3 border-muted border-t-transparent animate-spin" />
              </div>
              <div className="h-10 w-64 bg-muted/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      }>
        <HeroSection
          titleKey="home.trending"
          fallbackTitle="Trending"
          descriptionKey="home.trendingDescription"
          fallbackDescription="Drama-drama paling populer yang sedang ditonton banyak orang!"
          icon="trending"
          lang={language}
        />
      </Suspense>

      <div className="container mx-auto px-4 pb-12">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <TrendingDramas lang={language} />
        </Suspense>
      </div>
    </main>
  );
}
