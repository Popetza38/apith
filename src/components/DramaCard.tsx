import Link from "next/link";
import Image from "next/image";
import { Play, Flame } from "lucide-react";
import type { Drama } from "@/types/drama";
import type { SupportedLanguage } from "@/types/language";

// Simple inline translations to avoid async issues
const translations: Record<SupportedLanguage, { episodes: string; views: string }> = {
  in: { episodes: "Episode", views: "views" },
  en: { episodes: "Ep", views: "views" },
  th: { episodes: "ตอน", views: "ผู้ชม" },
  ar: { episodes: "حلقة", views: "مشاهدات" },
  pt: { episodes: "Ep", views: "views" },
  fr: { episodes: "Ép", views: "vues" },
  de: { episodes: "Ep", views: "Aufrufe" },
  ja: { episodes: "話", views: "回視聴" },
  es: { episodes: "Ep", views: "vistas" },
  zh: { episodes: "集", views: "觀看" },
  zhHans: { episodes: "集", views: "观看" },
};

interface DramaCardProps {
  drama: Drama;
  index?: number;
  language?: SupportedLanguage;
}

export function DramaCard({ drama, index = 0, language = 'in' }: DramaCardProps) {
  const coverUrl = drama.coverWap || drama.cover || "/placeholder-.svg"; // Added fallback
  const tags = drama.tags || drama.tagNames || [];

  // High priority for the first 6 items to improve LCP
  const isPriority = index < 6;

  return (
    <Link
      href={`/${language}/detail/${drama.bookId}`}
      className="group relative rounded-2xl overflow-hidden card-hover animate-fade-up block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Cover Image */}
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <Image
          src={coverUrl}
          alt={drama.bookName}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={isPriority}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

        {/* Corner Badge */}
        {drama.corner && (
          <div
            className="absolute top-3 left-3 badge-popular z-10"
            style={{ backgroundColor: drama.corner.color }}
          >
            {drama.corner.name}
          </div>
        )}

        {/* Rank Badge */}
        {drama.rankVo && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm z-10">
            <Flame className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-bold">{drama.rankVo.hotCode}</span>
          </div>
        )}

        {/* Episode Count */}
        <div className="absolute bottom-3 left-3 episode-count z-10">
          <Play className="w-3 h-3 text-primary" />
          <span>{drama.chapterCount} {translations[language]?.episodes || translations.in.episodes}</span>
        </div>

        {/* Play Count */}
        {drama.playCount && (
          <div className="absolute bottom-3 right-3 play-count z-10">
            <span>{drama.playCount} {translations[language]?.views || translations.in.views}</span>
          </div>
        )}

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {drama.bookName}
        </h3>

        {drama.protagonist && (
          <p className="text-xs text-muted-foreground truncate">
            {drama.protagonist}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
