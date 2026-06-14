import { useState } from "react";
import { TIER_COLORS } from "../../data/schools";
import type { SchoolTier } from "../../data/schools";

interface SchoolLogoProps {
  school: {
    shortName: string;
    website?: string;
    icon: string;
    tier: SchoolTier;
    logoPath?: string;
  };
  size?: "sm" | "md" | "lg";
}

function getDomain(url?: string): string | null {
  if (!url) return null;
  try { return new URL(url).hostname; } catch { return null; }
}

export default function SchoolLogo({ school, size = "md" }: SchoolLogoProps) {
  const tierColors = TIER_COLORS[school.tier];
  const domain = getDomain(school.website);
  const startLevel = school.logoPath ? 0 : domain ? 1 : 3;
  const [level, setLevel] = useState(startLevel);

  const sizeClass =
    size === "sm" ? "w-9 h-9 text-lg" :
    size === "lg" ? "w-20 h-20 text-4xl" :
    "w-11 h-11 text-2xl";

  const imgSizeClass =
    size === "sm" ? "w-7 h-7" :
    size === "lg" ? "w-full h-full" :
    "w-9 h-9";

  if (level >= 3 || (!school.logoPath && !domain)) {
    return (
      <div className={`${sizeClass} rounded-xl flex items-center justify-center flex-shrink-0 ${tierColors.bg} border ${tierColors.border}`}>
        {school.icon}
      </div>
    );
  }

  const src =
    level === 0 ? school.logoPath! :
    level === 1 ? `https://logo.clearbit.com/${domain}?size=${size === "lg" ? 128 : 64}` :
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size === "lg" ? 128 : 64}`;

  return (
    <div className={`${sizeClass} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border-2 ${tierColors.border} p-1`}>
      <img
        src={src}
        alt={school.shortName}
        className={`${imgSizeClass} object-contain`}
        onError={() => setLevel((l) => l + 1)}
      />
    </div>
  );
}
