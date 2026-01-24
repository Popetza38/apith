import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";

export const revalidate = 86400; // ISR every 24 hours

interface AboutPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for About page
 */
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const titles: Record<string, string> = {
    in: 'Tentang Kami - DramaBox',
    en: 'About Us - DramaBox',
    th: 'เกี่ยวกับเรา - DramaBox',
    ar: 'معلومات عنا - DramaBox',
    pt: 'Sobre Nós - DramaBox',
    fr: 'À Propos - DramaBox',
    de: 'Über Uns - DramaBox',
    ja: '私たちについて - DramaBox',
    es: 'Acerca De - DramaBox',
    zh: '關於我們 - DramaBox',
    zhHans: '关于我们 - DramaBox',
  };

  const descriptions: Record<string, string> = {
    in: 'DramaBox adalah platform streaming drama pendek terbaik dengan koleksi ribuan judul dari berbagai genre.',
    en: 'DramaBox is the best short drama streaming platform with a collection of thousands of titles from various genres.',
    th: 'DramaBox เป็นแพลตฟอร์มสตรีมมิงซีรีส์สั้นที่ดีที่สุดพร้อมคอลเลกชันซีรีส์หลายพันเรื่องจากหลากหลายประเภท',
    ar: 'دراما بوكس هو أفضل منصة لبث المسرحيات القصيرة مع مجموعة آلاف العناوين من مختلف الأنواع.',
    pt: 'DramaBox é a melhor plataforma de streaming de dramas curtos com uma coleção de milhares de títulos de vários gêneros.',
    fr: 'DramaBox est la meilleure plateforme de streaming de dramas courts avec une collection de milliers de titres de divers genres.',
    de: 'DramaBox ist die beste Streaming-Plattform für Kurzserien mit einer Sammlung von tausenden Titeln aus verschiedenen Genres.',
    ja: 'DramaBoxは、様々なジャンルの数千のタイトルをコレクションした、最高の短編ドラマストリーミングプラットフォームです。',
    es: 'DramaBox es la mejor plataforma de streaming de dramas cortos con una colección de miles de títulos de varios géneros.',
    zh: 'DramaBox 是最好的短劇串流平台，擁有來自各種類型的數千個標題收藏。',
    zhHans: 'DramaBox 是最好的短剧流媒体平台，拥有来自各种类型的数千个标题收藏。',
  };

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
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
          <AboutContent language={language} />
        </Suspense>
      </div>
    </main>
  );
}

async function AboutContent({ language }: { language: SupportedLanguage }) {
  const { tServer } = await import("@/lib/i18n");
  const content = await tServer(language, "about.content");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-8">
        {await tServer(language, "about.title")}
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
