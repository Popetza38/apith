"use client";

import type { SupportedLanguage } from '@/types/language';
import type { LocaleContent } from './server';

/**
 * Map to cache dynamically imported locales (client-side)
 * Persists across component re-renders
 */
const localeCache = new Map<SupportedLanguage, LocaleContent>();
const localePromises = new Map<SupportedLanguage, Promise<LocaleContent>>();

/**
 * Get locale content for Client Components
 * - Dynamic import (separate chunk per language)
 * - Cached in memory to avoid re-imports
 *
 * @param lang - Language code
 * @returns Promise of locale content
 */
export async function getClientLocale(lang: SupportedLanguage): Promise<LocaleContent> {
  // Return cached promise if already loading (prevents duplicate imports)
  if (localePromises.has(lang)) {
    return localePromises.get(lang)!;
  }

  // Return cached result if already loaded
  if (localeCache.has(lang)) {
    return localeCache.get(lang)!;
  }

  // Create import promise and cache it
  const importPromise = (async () => {
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

    // Cache the result
    localeCache.set(lang, locale);
    return locale;
  })();

  // Store promise to prevent duplicate imports during loading
  localePromises.set(lang, importPromise);

  // Clean up promise cache after loading (keep result cache)
  importPromise.then(() => {
    localePromises.delete(lang);
  });

  return importPromise;
}

/**
 * Get a nested value from locale content using dot notation (Client-side)
 * @param lang - Language code
 * @param path - Dot notation path (e.g., 'nav.home', 'seo.siteTitle')
 * @returns Promise of the localized value or fallback to Indonesian
 */
export async function tClient(lang: SupportedLanguage, path: string): Promise<string> {
  const locale = await getClientLocale(lang);
  const keys = path.split('.');
  let value: any = locale;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      // Fallback to Indonesian
      const fallbackLocale = await getClientLocale('in');
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
 * Get SEO metadata for a specific language (Client-side)
 * @param lang - Language code
 * @returns Promise of SEO metadata object
 */
export async function getClientSEOMetadata(lang: SupportedLanguage) {
  const locale = await getClientLocale(lang);
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
 * Get the direction (ltr/rtl) for a language (Client-side)
 * @param lang - Language code
 * @returns Promise of 'ltr' or 'rtl'
 */
export async function getClientLanguageDirection(lang: SupportedLanguage): Promise<'ltr' | 'rtl'> {
  const locale = await getClientLocale(lang);
  return locale.direction;
}

/**
 * Prefetch locale data for faster language switches
 * Call this when user hovers over language selector
 *
 * @param lang - Language code to prefetch
 */
export async function prefetchLocale(lang: SupportedLanguage): Promise<void> {
  // Trigger dynamic import to cache the chunk
  await getClientLocale(lang);
}

/**
 * Clear locale cache (useful for memory management)
 * Client components can call this when unmounting
 */
export function clearLocaleCache(): void {
  localeCache.clear();
  localePromises.clear();
}

/**
 * Re-export LocaleContent type for convenience
 */
export type { LocaleContent };
