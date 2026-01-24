"use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useForYouDramas } from "@/hooks/useDramas";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export default function HomeContent() {
  const { language } = useLanguage();
  const { data: dramas, isLoading, error } = useForYouDramas(language);

  return (
    <main className="min-h-screen">
      <HeroSection
        titleKey="home.forYou"
        descriptionKey="home.forYouDescription"
        icon="sparkles"
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
