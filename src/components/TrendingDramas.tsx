"use client";

import { DramaGrid } from "@/components/DramaGrid";
import { useTrendingDramas } from "@/hooks/useDramas";
import type { SupportedLanguage } from "@/types/language";

interface TrendingDramasProps {
  lang: SupportedLanguage;
}

export function TrendingDramas({ lang }: TrendingDramasProps) {
  const { data: dramas, isLoading, error } = useTrendingDramas(lang);

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
