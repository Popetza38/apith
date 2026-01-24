import { useQuery } from "@tanstack/react-query";
import type { DramaDetailResponse, Episode } from "@/types/drama";
import type { SupportedLanguage } from "@/types/language";

const API_BASE = "/api/dramabox";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchDramaDetail(bookId: string, lang?: SupportedLanguage): Promise<DramaDetailResponse> {
  const url = lang
    ? `${API_BASE}/detail/${bookId}?lang=${lang}`
    : `${API_BASE}/detail/${bookId}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch drama detail");
  }
  const result: ApiResponse<DramaDetailResponse> = await response.json();
  return result.data;
}

async function fetchAllEpisodes(bookId: string, lang?: SupportedLanguage): Promise<Episode[]> {
  const url = lang
    ? `${API_BASE}/allepisode/${bookId}?lang=${lang}`
    : `${API_BASE}/allepisode/${bookId}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }
  const result: ApiResponse<Episode[]> = await response.json();
  return result.data;
}

export function useDramaDetail(bookId: string, lang?: SupportedLanguage) {
  return useQuery({
    queryKey: ["drama", "detail", bookId, lang],
    queryFn: () => fetchDramaDetail(bookId, lang),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useEpisodes(bookId: string, lang?: SupportedLanguage) {
  return useQuery({
    queryKey: ["drama", "episodes", bookId, lang],
    queryFn: () => fetchAllEpisodes(bookId, lang),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
