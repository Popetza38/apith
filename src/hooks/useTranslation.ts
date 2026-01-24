"use client";

import { useEffect, useState, useMemo } from "react";
import type { SupportedLanguage } from "@/types/language";
import { tClient, prefetchLocale } from "@/lib/i18n";

/**
 * Client-side translation hook
 * Provides synchronous translations for Client Components
 * Uses internal state to cache translations and trigger re-renders
 */
export function useTranslation(language: SupportedLanguage) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations on mount and when language changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);
      try {
        // Prefetch and cache the locale
        await prefetchLocale(language);

        // Comprehensive translation keys for all components
        const keys = [
          // Navigation
          "nav.home",
          "nav.latest",
          "nav.popular",
          "nav.dubbed",
          "nav.search",
          "nav.language",
          // Buttons
          "buttons.watchNow",
          "buttons.readMore",
          "buttons.loadMore",
          "buttons.share",
          "buttons.bookmark",
          "buttons.bookmarked",
          "buttons.like",
          "buttons.liked",
          // Detail
          "detail.episodes",
          "detail.episode",
          "detail.synopsis",
          "detail.status",
          "detail.author",
          "detail.views",
          "detail.likes",
          "detail.chapters",
          "detail.related",
          "detail.comments",
          // Status
          "status.ongoing",
          "status.completed",
          "status.hiatus",
          // Errors
          "errors.notFound",
          "errors.somethingWentWrong",
          "errors.tryAgain",
          "errors.goBack",
          "errors.goHome",
          "errors.failedToLoad",
          "errors.noDramasFound",
          "errors.noSearchResults",
          "errors.searchPlaceholder",
          // Pagination
          "pagination.previous",
          "pagination.next",
          "pagination.page",
          "pagination.of",
          // Watch
          "watch.episodeList",
          // Loading
          "loading.loadingDrama",
          "loading.preparingEpisodes",
          // Home
          "home.forYou",
          "home.forYouDescription",
          "home.trending",
          "home.continueWatching",
          "home.recommended",
          "home.latestDescription",
          "home.trendingDescription",
          "home.dubbedDescription",
          // Page
          "page.latest.title",
          "page.latest.description",
          "page.popular.title",
          "page.popular.description",
          "page.dubbed.title",
          "page.dubbed.description",
        ];

        const translationsMap: Record<string, string> = {};
        for (const key of keys) {
          translationsMap[key] = await tClient(language, key);
        }

        if (mounted) {
          setTranslations(translationsMap);
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [language]);

  // Synchronous translation function
  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      if (isLoading) {
        return fallback || key;
      }
      return translations[key] || fallback || key;
    };
  }, [translations, isLoading]);

  // Async translation function with interpolation support
  const tAsync = useMemo(() => {
    return async (key: string, params?: Record<string, string>): Promise<string> => {
      let result = await tClient(language, key);
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          result = result.replace(`{${param}}`, value);
        });
      }
      return result;
    };
  }, [language]);

  return {
    t,
    tAsync,
    isLoading,
  };
}
