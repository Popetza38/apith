"use client";

import { DramaGrid } from "@/components/DramaGrid";
import { useForYouDramas } from "@/hooks/useDramas";
import type { SupportedLanguage } from "@/types/language";

interface ForYouDramasProps {
  lang: SupportedLanguage;
}

export function ForYouDramas({ lang }: ForYouDramasProps) {
  const { data: dramas, isLoading, error } = useForYouDramas(lang);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          {lang === 'in' ? 'Gagal memuat drama. Silakan coba lagi.' : 'Failed to load dramas. Please try again.'}
        </p>
      </div>
    );
  }

  return <DramaGrid dramas={dramas} isLoading={isLoading} language={lang} />;
}
