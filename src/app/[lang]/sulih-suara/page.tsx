import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";
import { DubbedContent } from "@/components/DubbedContent";

export const revalidate = 3600; // ISR every 1 hour

interface SulihSuaraPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Sulih Suara page
 */
export async function generateMetadata({ params }: SulihSuaraPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  return {
    title: language === 'in' ? 'Sulih Suara - DramaBox' : `Dubbed - DramaBox`,
    description: language === 'in'
      ? 'Drama dengan dubbing bahasa Indonesia'
      : 'Dramas with Indonesian dubbing',
  };
}

export default async function SulihSuaraPage({ params }: SulihSuaraPageProps) {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language
  if (!isSupportedLanguage(language)) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DubbedContent lang={language} />
    </Suspense>
  );
}
