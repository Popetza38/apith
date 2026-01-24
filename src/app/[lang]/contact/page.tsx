import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SupportedLanguage } from "@/types/language";
import { isSupportedLanguage } from "@/lib/i18n";

export const revalidate = 86400; // ISR every 24 hours

interface ContactPageProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate metadata for Contact page
 */
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const titles: Record<string, string> = {
    in: 'Hubungi Kami - DramaBox',
    en: 'Contact Us - DramaBox',
    th: 'ติดต่อเรา - DramaBox',
    ar: 'اتصل بنا - DramaBox',
    pt: 'Fale Conosco - DramaBox',
    fr: 'Contactez-Nous - DramaBox',
    de: 'Kontaktiere Uns - DramaBox',
    ja: 'お問い合わせ - DramaBox',
    es: 'Contáctanos - DramaBox',
    zh: '聯絡我們 - DramaBox',
    zhHans: '联系我们 - DramaBox',
  };

  const descriptions: Record<string, string> = {
    in: 'Hubungi tim DramaBox untuk pertanyaan, saran, atau dukungan.',
    en: 'Contact the DramaBox team for questions, suggestions, or support.',
    th: 'ติดต่อทีมงาน DramaBox สำหรับคำถาม ข้อเสนอง หรือการสนับสนุน',
    ar: 'اتصل بفريق DramaBox للأسئلة أو الاقتراحات أو الدعم',
    pt: 'Entre em contato com a equipe DramaBox para dúvidas, sugestões ou suporte.',
    fr: 'Contactez l\'équipe DramaBox pour les questions, suggestions ou support.',
    de: 'Kontaktieren Sie das DramaBox-Team für Fragen, Vorschläge oder Support.',
    ja: 'DramaBoxチームにお問い合わせください',
    es: 'Ponte en contacto con el equipo de DramaBox para preguntas o soporte.',
    zh: '聯絡 DramaBox 團隊尋求問、建議或支持',
    zhHans: '联系 DramaBox 团队寻求问、建议或支持',
  };

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
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
          <ContactContent language={language} />
        </Suspense>
      </div>
    </main>
  );
}

async function ContactContent({ language }: { language: SupportedLanguage }) {
  const { tServer } = await import("@/lib/i18n");
  const content = await tServer(language, "contact.content");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-8">
        {await tServer(language, "contact.title")}
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>

      {/* Contact Form */}
      <div className="mt-12 p-8 rounded-2xl glass">
        <h2 className="text-2xl font-bold mb-6 gradient-text">
          {await tServer(language, "contact.formTitle")}
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {await tServer(language, "contact.name")}
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder={await tServer(language, "contact.namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {await tServer(language, "contact.email")}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder={await tServer(language, "contact.emailPlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {await tServer(language, "contact.message")}
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder={await tServer(language, "contact.messagePlaceholder")}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {await tServer(language, "contact.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
