"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/types/language";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as SupportedLanguage)}
    >
      <SelectTrigger className="w-[140px] h-9 text-sm">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{LANGUAGE_CONFIG[language].flag}</span>
            <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang} className="text-sm">
            <span className="flex items-center gap-2">
              <span>{LANGUAGE_CONFIG[lang].flag}</span>
              <span>{LANGUAGE_CONFIG[lang].nativeName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
