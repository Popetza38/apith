import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import dynamic from "next/dynamic";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { registerSW } from "@/lib/sw-registration";
import { cn } from "@/lib/utils";

const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster));
const Sonner = dynamic(() => import("@/components/ui/sonner").then(mod => mod.Toaster));
const SWUpdateBanner = dynamic(() => import("@/components/SWUpdateBanner").then(mod => mod.SWUpdateBanner));

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// ============================================
// PWA Metadata
// ============================================
export const metadata: Metadata = {
  title: "DramaBox - Streaming Drama Pendek",
  description: "Nonton drama pendek gratis dan tanpa iklan. Temukan ribuan drama menarik dari berbagai genre.",
  applicationName: "DramaBox",
  authors: [{ name: "DramaBox" }],
  generator: "Next.js",
  keywords: ["drama pendek", "streaming drama", "nonton drama gratis", "DramaBox", "drama"],
  referrer: "origin-when-cross-origin",
  creator: "DramaBox",
  publisher: "DramaBox",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DramaBox",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ============================================
// Register Service Worker (Client Component)
// ============================================
function SWRegistration() {
  if (typeof window !== 'undefined') {
    registerSW();
  }
  return null;
}

// ============================================
// Root Layout
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* PWA Theme Color */}
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* PWA Mobile Web App Capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DramaBox" />
      </head>
      <body className={cn(
        "font-sans antialiased",
        inter.variable,
        spaceGrotesk.variable
      )}>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
          <SWUpdateBanner />
        </Providers>
        <SWRegistration />
      </body>
    </html>
  );
}
