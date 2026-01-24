"use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useTrendingDramas } from "@/hooks/useDramas";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export default function TerpopulerContent() {
  const { language } = useLanguage();
  const { data: dramas, isLoading, error } = useTrendingDramas(language);

  return (
    <main className="min-h-screen">
      <HeroSection
        titleKey="page.popular.title"
        descriptionKey="page.popular.description"
        icon="trending"
        lang={language}
      />

      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{t(language, "errors.failedToLoad")}</p>
          </div>
        )}

        <DramaGrid dramas={dramas} isLoading={isLoading} language={language} />
      </div>
    </main>
  );
}
