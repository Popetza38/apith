import { NextRequest } from 'next/server';
import type { SupportedLanguage } from '@/types/language';

/**
 * Supported languages for routing
 */
const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'in', 'en', 'th', 'ar', 'pt', 'fr', 'de', 'ja', 'es', 'zh', 'zhHans'
];

/**
 * Default language
 */
const DEFAULT_LANGUAGE: SupportedLanguage = 'th';

/**
 * Map of browser language codes to our supported languages
 */
const BROWSER_LANG_MAP: Record<string, SupportedLanguage> = {
  'id': 'in',          // Indonesian
  'in': 'in',          // Indonesia
  'en': 'en',          // English
  'th': 'th',          // Thai
  'ar': 'ar',          // Arabic
  'pt': 'pt',          // Portuguese
  'pt-br': 'pt',       // Portuguese (Brazil)
  'fr': 'fr',          // French
  'de': 'de',          // German
  'ja': 'ja',          // Japanese
  'es': 'es',          // Spanish
  'zh-tw': 'zh',       // Chinese (Taiwan)
  'zh-hant': 'zh',     // Chinese Traditional
  'zh-cn': 'zhHans',   // Chinese (China)
  'zh-hans': 'zhHans', // Chinese Simplified
};

/**
 * Detect language from Accept-Language header
 */
function detectLanguage(acceptLanguage: string | null): SupportedLanguage {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.toLowerCase().split('-')[0],
        quality: qValue ? parseFloat(qValue) : 1.0
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Try to find matching language
  for (const lang of languages) {
    // Direct match
    if (SUPPORTED_LANGUAGES.includes(lang.code as SupportedLanguage)) {
      return lang.code as SupportedLanguage;
    }

    // Check browser language map
    const mappedLang = BROWSER_LANG_MAP[lang.code];
    if (mappedLang) {
      return mappedLang;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Proxy to handle i18n routing (Next.js 16)
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip proxy for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions (favicon.ico, etc.)
  ) {
    return;
  }

  // Extract potential language code from path
  const pathSegments = pathname.split('/');
  const potentialLang = pathSegments[1] as SupportedLanguage;

  // Check if path already has a valid language code
  if (SUPPORTED_LANGUAGES.includes(potentialLang)) {
    // Language is valid, continue with request
    // Add language-specific headers via request headers
    request.headers.set('x-page-language', potentialLang);
    request.headers.set('content-language', potentialLang);
    return;
  }

  // No valid language in URL, detect and redirect
  const detectedLang = detectLanguage(request.headers.get('accept-language'));

  // Build new URL with language prefix
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLang}${pathname === '/' ? '' : pathname}`;

  // Return redirect response
  return Response.redirect(url, 307); // Temporary redirect
}

/**
 * Route matcher configuration for proxy (Next.js 16)
 */
export const routeMatcher = [
  // Match all paths except:
  // - API routes
  // - _next (Next.js internals)
  // - Static files (files with extensions)
  // - favicon.ico, robots.txt, etc.
  '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
];
