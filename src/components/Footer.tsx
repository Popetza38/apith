"use client";

import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${language}`} className="flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">
                DramaBox
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {t(language, "footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t(language, "footer.navigation")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${language}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "nav.home")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/terbaru`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "nav.latest")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/terpopuler`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "nav.popular")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/sulih-suara`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "nav.dubbed")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / More */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t(language, "footer.more")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${language}/about`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "footer.about")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/contact`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t(language, "footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DramaBox. {t(language, "footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
