"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DramaCard } from "@/components/DramaCard";
import { DramaCardSkeleton } from "@/components/DramaCardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Drama } from "@/types/drama";
import type { SupportedLanguage } from "@/types/language";

const API_BASE = "/api/dramabox";

type ClassifyType = "terbaru" | "terpopuler";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchDubbedDramas(classify: ClassifyType, page: number, lang?: SupportedLanguage): Promise<Drama[]> {
  const url = lang
    ? `${API_BASE}/dubbed?classify=${classify}&page=${page}&lang=${lang}`
    : `${API_BASE}/dubbed?classify=${classify}&page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch dubbing dramas");
  }

  const result: ApiResponse<Drama[]> = await response.json();
  return result.data;
}

export default function SulihSuaraContent() {
  const { language } = useLanguage();
  const [classify, setClassify] = useState<ClassifyType>("terbaru");
  const [page, setPage] = useState(1);

  const { data: dramas, isLoading, isFetching } = useQuery({
    queryKey: ["dramas", "dubbed", classify, page, language],
    queryFn: () => fetchDubbedDramas(classify, page, language),
    staleTime: 1000 * 60 * 5,
  });

  const handleClassifyChange = (newClassify: ClassifyType) => {
    setClassify(newClassify);
    setPage(1);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
            {t(language, "page.dubbed.title")}
          </h1>
          <p className="text-muted-foreground">
            {t(language, "page.dubbed.description")}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => handleClassifyChange("terbaru")}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              classify === "terbaru"
                ? "bg-primary text-primary-foreground"
                : "glass hover:bg-muted/50"
            }`}
          >
            {t(language, "filters.latest")}
          </button>
          <button
            onClick={() => handleClassifyChange("terpopuler")}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              classify === "terpopuler"
                ? "bg-primary text-primary-foreground"
                : "glass hover:bg-muted/50"
            }`}
          >
            {t(language, "filters.popular")}
          </button>
        </div>

        {/* Drama Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <DramaCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {dramas?.map((drama, index) => (
                <DramaCard key={drama.bookId} drama={drama} index={index} language={language} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="px-6 py-2.5 rounded-full font-medium glass hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t(language, "pagination.previous")}
              </button>
              <span className="px-4 py-2 glass rounded-full font-medium">
                {t(language, "pagination.page")} {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching || (dramas && dramas.length === 0)}
                className="px-6 py-2.5 rounded-full font-medium glass hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t(language, "pagination.next")}
              </button>
            </div>
          </>
        )}

        {/* Loading Overlay for Page Changes */}
        {isFetching && !isLoading && (
          <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </main>
  );
}
