import type { SupportedLanguage } from '@/types/language';

/**
 * Type definition for locale content
 */
export type LocaleContent = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  direction: 'ltr' | 'rtl';
  seo: {
    siteTitle: string;
    siteDescription: string;
    siteKeywords: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  nav: Record<string, string>;
  home: Record<string, string>;
  page: Record<string, Record<string, string>>;
  buttons: Record<string, string>;
  filters: Record<string, string>;
  genres: Record<string, string>;
  detail: Record<string, string>;
  status: Record<string, string>;
  errors: Record<string, string>;
  footer: Record<string, string>;
  pagination: Record<string, string>;
  watch: Record<string, string>;
  loading: Record<string, string>;
};

/**
 * Map to cache imported locales (server-side)
 * Server restart = cache cleared
 */
const localeCache = new Map<SupportedLanguage, LocaleContent>();

/**
 * Get locale content for Server Components
 * - Direct import (bundled in server)
 * - Cached in memory for performance
 *
 * @param lang - Language code
 * @returns Locale content
 */
export async function getServerLocale(lang: SupportedLanguage): Promise<LocaleContent> {
  // Check cache first
  if (localeCache.has(lang)) {
    return localeCache.get(lang)!;
  }

  // Direct import - Next.js will tree-shake unused locales in server bundle
  let locale: LocaleContent;
  switch (lang) {
    case 'in':
      locale = (await import('./locales/in.json')).default as LocaleContent;
      break;
    case 'en':
      locale = (await import('./locales/en.json')).default as LocaleContent;
      break;
    case 'th':
      locale = (await import('./locales/th.json')).default as LocaleContent;
      break;
    case 'ar':
      locale = (await import('./locales/ar.json')).default as LocaleContent;
      break;
    case 'pt':
      locale = (await import('./locales/pt.json')).default as LocaleContent;
      break;
    case 'fr':
      locale = (await import('./locales/fr.json')).default as LocaleContent;
      break;
    case 'de':
      locale = (await import('./locales/de.json')).default as LocaleContent;
      break;
    case 'ja':
      locale = (await import('./locales/ja.json')).default as LocaleContent;
      break;
    case 'es':
      locale = (await import('./locales/es.json')).default as LocaleContent;
      break;
    case 'zh':
      locale = (await import('./locales/zh.json')).default as LocaleContent;
      break;
    case 'zhHans':
      locale = (await import('./locales/zhHans.json')).default as LocaleContent;
      break;
    default:
      locale = (await import('./locales/in.json')).default as LocaleContent;
  }

  // Cache for future requests
  localeCache.set(lang, locale);
  return locale;
}

/**
 * Get a nested value from locale content using dot notation (Server-side)
 * @param lang - Language code
 * @param path - Dot notation path (e.g., 'nav.home', 'seo.siteTitle')
 * @returns The localized value or fallback to Indonesian
 */
export async function tServer(lang: SupportedLanguage, path: string): Promise<string> {
  const locale = await getServerLocale(lang);
  const keys = path.split('.');
  let value: any = locale;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      // Fallback to Indonesian
      const fallbackLocale = await getServerLocale('in');
      let fallbackValue: any = fallbackLocale;
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
        if (fallbackValue === undefined) return path;
      }
      return fallbackValue;
    }
  }

  return value;
}

/**
 * Get SEO metadata for a specific language (Server-side)
 * @param lang - Language code
 * @returns SEO metadata object
 */
export async function getServerSEOMetadata(lang: SupportedLanguage) {
  const locale = await getServerLocale(lang);
  return {
    siteTitle: locale.seo.siteTitle,
    siteDescription: locale.seo.siteDescription,
    siteKeywords: locale.seo.siteKeywords,
    ogTitle: locale.seo.ogTitle,
    ogDescription: locale.seo.ogDescription,
    twitterTitle: locale.seo.twitterTitle,
    twitterDescription: locale.seo.twitterDescription,
  };
}

/**
 * Check if a language code is supported (Server-side)
 * @param code - Language code to check
 * @returns True if supported
 */
export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return ['in', 'en', 'th', 'ar', 'pt', 'fr', 'de', 'ja', 'es', 'zh', 'zhHans'].includes(code);
}

/**
 * Get the direction (ltr/rtl) for a language (Server-side)
 * @param lang - Language code
 * @returns 'ltr' or 'rtl'
 */
export async function getServerLanguageDirection(lang: SupportedLanguage): Promise<'ltr' | 'rtl'> {
  const locale = await getServerLocale(lang);
  return locale.direction;
}

/**
 * Get all available language codes (Server-side)
 * @returns Array of supported language codes
 */
export function getServerAvailableLanguages(): SupportedLanguage[] {
  return ['in', 'en', 'th', 'ar', 'pt', 'fr', 'de', 'ja', 'es', 'zh', 'zhHans'];
}
