import type { SupportedLanguage } from '@/types/language';
import { DEFAULT_LANGUAGE, validateLanguage } from '@/types/language';

/**
 * Build API URL with language parameter
 *
 * @param endpoint - The API endpoint (e.g., "foryou", "latest", "trending")
 * @param lang - Optional language code. If not provided, uses DEFAULT_LANGUAGE
 * @returns Full URL with language parameter
 *
 * @example
 * ```ts
 * buildUrlWithLang("foryou")              // "/api/dramabox/foryou?lang=in"
 * buildUrlWithLang("foryou", "en")        // "/api/dramabox/foryou?lang=en"
 * buildUrlWithLang("latest", "ja")        // "/api/dramabox/latest?lang=ja"
 * ```
 */
export function buildUrlWithLang(endpoint: string, lang?: SupportedLanguage): string {
  const apiBase = '/api/dramabox';
  const language = lang || DEFAULT_LANGUAGE;

  // Handle endpoints with existing query parameters
  const separator = endpoint.includes('?') ? '&' : '?';

  return `${apiBase}/${endpoint}${separator}lang=${language}`;
}

/**
 * Build API URL with language parameter and additional query params
 *
 * @param endpoint - The API endpoint
 * @param params - Record of query parameters
 * @param lang - Optional language code
 * @returns Full URL with language and additional query parameters
 *
 * @example
 * ```ts
 * buildUrlWithParams("search", { query: "action" }, "en")
 * // "/api/dramabox/search?query=action&lang=en"
 *
 * buildUrlWithParams("dubbed", { classify: "terbaru", page: "1" }, "th")
 * // "/api/dramabox/dubbed?classify=terbaru&page=1&lang=th"
 * ```
 */
export function buildUrlWithParams(
  endpoint: string,
  params: Record<string, string>,
  lang?: SupportedLanguage
): string {
  const apiBase = '/api/dramabox';
  const language = lang || DEFAULT_LANGUAGE;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  searchParams.append('lang', language);

  return `${apiBase}/${endpoint}?${searchParams.toString()}`;
}

/**
 * Validate language from an unknown source (query param, header, etc.)
 *
 * @param lang - Language string to validate
 * @returns Valid SupportedLanguage or DEFAULT_LANGUAGE
 */
export function validateLanguageParam(lang: string | null | undefined): SupportedLanguage {
  return validateLanguage(lang);
}

/**
 * Extract language from URLSearchParams with validation
 *
 * @param searchParams - URLSearchParams object
 * @param fallback - Fallback language if not found (defaults to DEFAULT_LANGUAGE)
 * @returns Valid SupportedLanguage
 */
export function getLanguageFromParams(
  searchParams: URLSearchParams | string,
  fallback: SupportedLanguage = DEFAULT_LANGUAGE
): SupportedLanguage {
  let langStr: string | null = null;

  if (typeof searchParams === 'string') {
    const params = new URLSearchParams(searchParams);
    langStr = params.get('lang');
  } else {
    langStr = searchParams.get('lang');
  }

  return langStr ? validateLanguage(langStr) : fallback;
}
