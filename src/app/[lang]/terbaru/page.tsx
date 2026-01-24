import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";
import { HeroSection } from "@/components/HeroSection";
import { LatestDramas } from "@/components/LatestDramas";

export const revalidate = 3600; // ISR every 1 hour

interface TerbaruPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Terbaru page
 */
export async function generateMetadata({ params }: TerbaruPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  return {
    title: language === 'in' ? 'Terbaru - DramaBox' : `Latest - DramaBox`,
    description: language === 'in'
      ? 'Drama-drama terbaru yang baru saja rilis. Jangan sampai ketinggalan!'
      : 'The latest dramas that have just been released. Don\'t miss out!',
  };
}

export default async function TerbaruPage({ params }: TerbaruPageProps) {
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
          titleKey="nav.latest"
          fallbackTitle="Terbaru"
          descriptionKey="home.latestDescription"
          fallbackDescription="Drama-drama terbaru yang baru saja rilis. Jangan sampai ketinggalan!"
          icon="clock"
          lang={language}
        />
      </Suspense>

      <div className="container mx-auto px-4 pb-12">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <LatestDramas lang={language} />
        </Suspense>
      </div>
    </main>
  );
}
