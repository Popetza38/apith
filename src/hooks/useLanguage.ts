import { useLanguageContext } from '@/contexts/LanguageContext';
import type { SupportedLanguage } from '@/types/language';

/**
 * Custom hook to access the current language and language setter
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { language, setLanguage } = useLanguage();
 *
 *   return (
 *     <div>
 *       <p>Current language: {language}</p>
 *       <button onClick={() => setLanguage('en')}>Switch to English</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguage(): {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
} {
  const context = useLanguageContext();
  return {
    language: context.language,
    setLanguage: context.setLanguage,
  };
}
