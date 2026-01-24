"use client";

import { DramaGrid } from "@/components/DramaGrid";
import { useLatestDramas } from "@/hooks/useDramas";
import type { SupportedLanguage } from "@/types/language";

interface LatestDramasProps {
  lang: SupportedLanguage;
}

export function LatestDramas({ lang }: LatestDramasProps) {
  const { data: dramas, isLoading, error } = useLatestDramas(lang);

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
