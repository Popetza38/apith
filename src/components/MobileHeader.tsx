// ============================================
// Mobile-Optimized Header Component
// ============================================
// Header yang khusus dioptimalkan untuk mobile dengan scroll behavior

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Bell, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onSearchClick?: () => void;
}

export function MobileHeader({ title, showBack, onSearchClick }: MobileHeaderProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: `/${language}`, label: "Home" },
    { href: `/${language}/terbaru`, label: "Terbaru" },
    { href: `/${language}/terpopuler`, label: "Populer" },
    { href: `/${language}/sulih-suara`, label: "Dubbed" },
    { href: `/${language}/about`, label: "Tentang" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 md:hidden",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-sm border-b border-border/50"
            : "bg-background/95 backdrop-blur"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 safe-area-inset-top">
          {/* Left Section - Back Button or Logo */}
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors touch-manipulation"
                aria-label="Kembali"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link href={`/${language}`} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <span className="font-bold text-lg gradient-text hidden sm:block">
                  DramaBox
                </span>
              </Link>
            )}
            {title && (
              <h1 className="text-base font-semibold truncate max-w-[200px]">
                {title}
              </h1>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSearchClick}
              className="p-2.5 rounded-full hover:bg-accent transition-colors touch-manipulation"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 rounded-full hover:bg-accent transition-colors touch-manipulation relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full hover:bg-accent transition-colors touch-manipulation ml-1"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-[60px] left-0 right-0 z-40 md:hidden bg-background border-b border-border">
            <nav className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base hover:bg-accent transition-colors touch-manipulation"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Safe area for iPhone X+ */}
      <style jsx>{`
        @supports (padding-top: env(safe-area-inset-top)) {
          .safe-area-inset-top {
            padding-top: env(safe-area-inset-top);
          }
        }
      `}</style>
    </>
  );
}
