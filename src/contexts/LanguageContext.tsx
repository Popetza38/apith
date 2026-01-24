"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SupportedLanguage } from '@/types/language';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  validateLanguage,
  getLanguageFromBrowser,
} from '@/types/language';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage || DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount, or use initialLanguage from route
  useEffect(() => {
    if (initialLanguage) {
      // If initialLanguage is provided from route, use it
      setLanguageState(initialLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, initialLanguage);
      setIsInitialized(true);
    } else {
      // Otherwise load from localStorage or detect from browser
      const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLang) {
        const validated = validateLanguage(storedLang);
        setLanguageState(validated);
      } else {
        // Auto-detect from browser if no stored preference
        const browserLang = getLanguageFromBrowser(navigator.language);
        setLanguageState(browserLang);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, browserLang);
      }
      setIsInitialized(true);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Navigate to new language route
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        // Check if currently on detail or watch page
        // If so, redirect to homepage instead of keeping the bookId
        // because bookId content doesn't support multi-language
        const isDetailOrWatchPage = pathSegments[1] === 'detail' || pathSegments[1] === 'watch';

        if (isDetailOrWatchPage) {
          // Redirect to homepage in new language
          window.location.href = '/' + lang;
        } else {
          // Replace the first segment (language code) with new language
          pathSegments[0] = lang;
          window.location.href = '/' + pathSegments.join('/');
        }
      }
    }
  };

  // Don't render children until language is initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
