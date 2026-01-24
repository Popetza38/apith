/**
 * i18n - Internationalization
 *
 * Architecture:
 * - Server Components: Use functions from 'server.ts' (direct import, bundled in server)
 * - Client Components: Use functions from 'client.ts' (dynamic import, separate chunks)
 *
 * This reduces initial bundle size from ~52KB to ~4.7KB (90% reduction)
 */

import type { SupportedLanguage } from '@/types/language';
import type { LocaleContent } from './server';
import {
  getServerLocale,
  tServer,
  getServerSEOMetadata,
  getServerLanguageDirection,
} from './server';
import {
  getClientLocale,
  tClient,
  getClientSEOMetadata,
  getClientLanguageDirection,
} from './client';

// Server-side functions (for Server Components)
export {
  getServerLocale,
  tServer,
  getServerSEOMetadata,
  getServerLanguageDirection,
  isSupportedLanguage,
  getServerAvailableLanguages,
} from './server';

// Client-side functions (for Client Components)
export {
  getClientLocale,
  tClient,
  getClientSEOMetadata,
  getClientLanguageDirection,
  prefetchLocale,
  clearLocaleCache,
} from './client';

/**
 * @deprecated Use tServer() for Server Components or tClient() for Client Components
 * This is kept for backward compatibility but should be replaced
 */
export async function t(lang: SupportedLanguage, path: string): Promise<string> {
  // For client components, use dynamic import
  if (typeof window !== 'undefined') {
    return tClient(lang, path);
  }
  // For server components, use direct import
  return tServer(lang, path);
}

/**
 * @deprecated Use getServerLocale() or getClientLocale()
 */
export async function getLocale(lang: SupportedLanguage): Promise<LocaleContent> {
  if (typeof window !== 'undefined') {
    return getClientLocale(lang);
  }
  return getServerLocale(lang);
}

/**
 * @deprecated Use getServerSEOMetadata() or getClientSEOMetadata()
 */
export async function getSEOMetadata(lang: SupportedLanguage) {
  if (typeof window !== 'undefined') {
    return getClientSEOMetadata(lang);
  }
  return getServerSEOMetadata(lang);
}

/**
 * @deprecated Use getServerLanguageDirection() or getClientLanguageDirection()
 */
export async function getLanguageDirection(lang: SupportedLanguage): Promise<'ltr' | 'rtl'> {
  if (typeof window !== 'undefined') {
    return getClientLanguageDirection(lang);
  }
  return getServerLanguageDirection(lang);
}
