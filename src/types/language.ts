/**
 * Supported languages for DramaBox web application
 */
export type SupportedLanguage =
  | 'in'      // Indonesian (Bahasa Indonesia)
  | 'en'      // English
  | 'th'      // Thai (ภาษาไทย)
  | 'ar'      // Arabic (العربية)
  | 'pt'      // Portuguese (Português)
  | 'fr'      // French (Français)
  | 'de'      // German (Deutsch)
  | 'ja'      // Japanese (日本語)
  | 'es'      // Spanish (Español)
  | 'zh'      // Chinese Traditional (繁體中文)
  | 'zhHans'; // Chinese Simplified (简体中文)

/**
 * Language configuration with metadata
 */
export const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}> = {
  in: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'United States' },
  th: { name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', region: 'Thailand' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Saudi Arabia' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain' },
  zh: { name: 'Chinese Traditional', nativeName: '繁體中文', flag: '🇹🇼', region: 'Taiwan' },
  zhHans: { name: 'Chinese Simplified', nativeName: '简体中文', flag: '🇨🇳', region: 'China' },
};

/**
 * All supported language codes as an array
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  'in', 'en', 'th', 'ar', 'pt', 'fr', 'de', 'ja', 'es', 'zh', 'zhHans'
];

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'in';

/**
 * Local storage key for language preference
 */
export const LANGUAGE_STORAGE_KEY = 'dramabox-language';

/**
 * Validate if a string is a supported language
 */
export function validateLanguage(lang: string | null | undefined): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/**
 * Get language code from browser's Accept-Language header
 */
export function getLanguageFromBrowser(acceptLanguage: string | null): SupportedLanguage {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();

  // Map browser language codes to our supported languages
  const langMap: Record<string, SupportedLanguage> = {
    'id': 'in',  // Indonesian
    'en': 'en',  // English
    'th': 'th',  // Thai
    'ar': 'ar',  // Arabic
    'pt': 'pt',  // Portuguese
    'fr': 'fr',  // French
    'de': 'de',  // German
    'ja': 'ja',  // Japanese
    'es': 'es',  // Spanish
    'zh': 'zh',  // Chinese (default to Traditional)
  };

  return langMap[browserLang] || DEFAULT_LANGUAGE;
}

/**
 * Get language display name with flag
 */
export function getLanguageDisplayName(lang: SupportedLanguage): string {
  const config = LANGUAGE_CONFIG[lang];
  return `${config.flag} ${config.nativeName}`;
}
