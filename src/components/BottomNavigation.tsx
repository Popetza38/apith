// ============================================
// Bottom Navigation Component for Mobile
// ============================================
// Bottom navigation bar untuk mobile UX yang optimal

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, TrendingUp, Volume2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/in", icon: Home, label: "Home" },
  { path: "/in/terbaru", icon: Clock, label: "Terbaru" },
  { path: "/in/terpopuler", icon: TrendingUp, label: "Populer" },
  { path: "/in/sulih-suara", icon: Volume2, label: "Dubbed" },
  { path: "/in/profil", icon: User, label: "Profil" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 min-w-[64px] touch-manipulation transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "relative mb-1 transition-transform duration-200",
                isActive && "scale-110"
              )}>
                <Icon className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "stroke-[2.5px]"
                )} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iPhone X+ */}
      <style jsx>{`
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .safe-area-inset-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </nav>
  );
}
