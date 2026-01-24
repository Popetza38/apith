import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";

export const revalidate = 86400; // ISR every 24 hours

interface TermsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Terms page
 */
export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const titles: Record<string, string> = {
    in: 'Syarat & Ketentuan - DramaBox',
    en: 'Terms of Service - DramaBox',
    th: 'เงื่อนไขและเงื่อนไขการบริการ - DramaBox',
    ar: 'شروط الخدمة - DramaBox',
    pt: 'Termos de Serviço - DramaBox',
    fr: 'Conditions d\'Utilisation - DramaBox',
    de: 'Nutzungsbedingungen - DramaBox',
    ja: '利用規約 - DramaBox',
    es: 'Términos de Servicio - DramaBox',
    zh: '服務條款 - DramaBox',
    zhHans: '服务条款 - DramaBox',
  };

  const descriptions: Record<string, string> = {
    in: 'Syarat dan ketentuan penggunaan layanan DramaBox.',
    en: 'Terms of service for using DramaBox platform.',
    th: 'เงื่อนไขและเงื่อนไขการใช้บริการ DramaBox',
    ar: 'شروط خدمة استخدام منصة DramaBox',
    pt: 'Termos de serviço para usar a plataforma DramaBox',
    fr: 'Conditions d\'utilisation de la plateforme DramaBox',
    de: 'Nutzungsbedingungen der DramaBox-Plattform',
    ja: 'DramaBoxプラットフォームの利用規約',
    es: 'Términos de servicio para usar la plataforma DramaBox',
    zh: 'DramaBox 平台服務條款',
    zhHans: 'DramaBox 平台服务条款',
  };

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language
  if (!isSupportedLanguage(language)) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="max-w-3xl mx-auto"><div className="h-8 bg-muted/50 rounded animate-pulse" /></div>}>
          <TermsContent language={language} />
        </Suspense>
      </div>
    </main>
  );
}

async function TermsContent({ language }: { language: SupportedLanguage }) {
  const { tServer } = await import("@/lib/i18n");
  const content = await tServer(language, "terms.content");
  const lastUpdated = await tServer(language, "terms.lastUpdated");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
        {await tServer(language, "terms.title")}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {lastUpdated}
      </p>

      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
