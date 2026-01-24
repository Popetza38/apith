import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { SupportedLanguage } from '@/types/language';
import { isSupportedLanguage, getServerSEOMetadata, getServerLanguageDirection } from '@/lib/i18n';
import { Providers } from '@/components/providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Suspense } from 'react';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Generate static params for all supported languages
 */
export async function generateStaticParams() {
  return [
    { lang: 'in' },
    { lang: 'en' },
    { lang: 'th' },
    { lang: 'ar' },
    { lang: 'pt' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'ja' },
    { lang: 'es' },
    { lang: 'zh' },
    { lang: 'zhHans' },
  ];
}

/**
 * Generate metadata for each language
 */
export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language
  if (!isSupportedLanguage(language)) {
    return {};
  }

  const seo = await getServerSEOMetadata(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramabox.net';

  return {
    title: seo.siteTitle,
    description: seo.siteDescription,
    keywords: seo.siteKeywords,
    authors: [{ name: 'DramaBox' }],
    creator: 'DramaBox',
    publisher: 'DramaBox',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${language}`,
      languages: {
        'id-ID': '/in',
        'en-US': '/en',
        'th-TH': '/th',
        'ar-SA': '/ar',
        'pt-BR': '/pt',
        'fr-FR': '/fr',
        'de-DE': '/de',
        'ja-JP': '/ja',
        'es-ES': '/es',
        'zh-TW': '/zh',
        'zh-CN': '/zhHans',
      },
    },
    openGraph: {
      type: 'website',
      locale: language === 'zhHans' ? 'zh_CN' : language === 'zh' ? 'zh_TW' : language,
      title: seo.ogTitle,
      description: seo.ogDescription,
      siteName: 'DramaBox',
      url: `/${language}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: ['/og-image.png'],
      creator: '@dramabox',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

/**
 * Language-specific layout
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const language = lang as SupportedLanguage;

  // Validate language - 404 if not supported
  if (!isSupportedLanguage(language)) {
    notFound();
  }

  const direction = await getServerLanguageDirection(language);

  return (
    <div lang={language} dir={direction}>
      <Providers language={language}>
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        {children}
        <Footer />
        <Toaster />
        <Sonner />
      </Providers>
    </div>
  );
}
