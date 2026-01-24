"use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useLatestDramas } from "@/hooks/useDramas";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export default function TerbaruContent() {
  const { language } = useLanguage();
  const { data: dramas, isLoading, error } = useLatestDramas(language);

  return (
    <main className="min-h-screen">
      <HeroSection
        titleKey="page.latest.title"
        descriptionKey="page.latest.description"
        icon="clock"
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
