import { useQuery } from "@tanstack/react-query";
import type { Drama, SearchResult } from "@/types/drama";
import type { SupportedLanguage } from "@/types/language";

const API_BASE = "/api/dramabox";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchDramas(endpoint: string, lang?: SupportedLanguage): Promise<Drama[]> {
  const url = lang
    ? `${API_BASE}/${endpoint}?lang=${lang}`
    : `${API_BASE}/${endpoint}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch dramas");
  }

  const result: ApiResponse<Drama[]> = await response.json();
  return result.data;
}

async function searchDramas(query: string, lang?: SupportedLanguage): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const url = lang
    ? `${API_BASE}/search?query=${encodeURIComponent(query)}&lang=${lang}`
    : `${API_BASE}/search?query=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to search dramas");
  }

  const result: ApiResponse<SearchResult[]> = await response.json();
  return result.data;
}

export function useForYouDramas(lang?: SupportedLanguage) {
  return useQuery({
    queryKey: ["dramas", "foryou", lang],
    queryFn: () => fetchDramas("foryou", lang),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useLatestDramas(lang?: SupportedLanguage) {
  return useQuery({
    queryKey: ["dramas", "latest", lang],
    queryFn: () => fetchDramas("latest", lang),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useTrendingDramas(lang?: SupportedLanguage) {
  return useQuery({
    queryKey: ["dramas", "trending", lang],
    queryFn: () => fetchDramas("trending", lang),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useSearchDramas(query: string, lang?: SupportedLanguage) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["dramas", "search", normalizedQuery, lang],
    queryFn: () => searchDramas(normalizedQuery, lang),
    enabled: normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
