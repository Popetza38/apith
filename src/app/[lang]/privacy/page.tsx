import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";

export const revalidate = 86400; // ISR every 24 hours

interface PrivacyPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Privacy page
 */
export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const titles: Record<string, string> = {
    in: 'Kebijakan Privasi - DramaBox',
    en: 'Privacy Policy - DramaBox',
    th: 'นโยบายความเป็นส่วนตัว - DramaBox',
    ar: 'سياسة الخصوصية - DramaBox',
    pt: 'Política de Privacidade - DramaBox',
    fr: 'Politique de Confidentialité - DramaBox',
    de: 'Datenschutzrichtlinie - DramaBox',
    ja: 'プライバシーポリシー - DramaBox',
    es: 'Política de Privacidad - DramaBox',
    zh: '隱私政策 - DramaBox',
    zhHans: '隐私政策 - DramaBox',
  };

  const descriptions: Record<string, string> = {
    in: 'Kebijakan privasi DramaBox menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
    en: 'DramaBox privacy policy explains how we collect, use, and protect your personal information.',
    th: 'นโยบายความเป็นส่วนตัวของ DramaBox อธิบายวิธีที่เรารวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณ',
    ar: 'توضح سياسة خصوصية DramaBox كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
    pt: 'A política de privacidade do DramaBox explica como coletamos, usamos e protegemos suas informações pessoais.',
    fr: 'La politique de confidentialité de DramaBox explique comment nous collectons, utilisons et protégeons vos informations personnelles.',
    de: 'Die Datenschutzrichtlinie von DramaBox erklärt, wie wir Ihre persönlichen Informationen sammeln, nutzen und schützen.',
    ja: 'DramaBoxのプライバシーポリシーは、個人情報の収集、使用、保護方法について説明しています。',
    es: 'La política de privacidad de DramaBox explica cómo recopilamos, utilizamos y protegemos su información personal.',
    zh: 'DramaBox 隱私政策解釋了我們如何收集、使用和保護您的個人信息。',
    zhHans: 'DramaBox 隐私政策解释了我们如何收集、使用和保护您的个人信息。',
  };

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
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
          <PrivacyContent language={language} />
        </Suspense>
      </div>
    </main>
  );
}

async function PrivacyContent({ language }: { language: SupportedLanguage }) {
  const { tServer } = await import("@/lib/i18n");
  const content = await tServer(language, "privacy.content");
  const lastUpdated = await tServer(language, "privacy.lastUpdated");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
        {await tServer(language, "privacy.title")}
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
