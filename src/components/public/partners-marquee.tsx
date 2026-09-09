import Image from "next/image";
import type { Partner } from "@/lib/types";

/**
 * Partner logo strip. Reproduces the live site's continuous marquee: the track
 * scrolls 0 → -50% over 20s (seamless because the logos are duplicated) and
 * pauses on hover. Logos sit at 70% opacity and brighten on hover.
 * Falls back to the partner name as a text chip when no logo is uploaded.
 */
export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  const track = [...partners, ...partners];

  return (
    <div className="group relative w-full overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
        {track.map((p, i) => {
          const inner = p.logo_url ? (
            <Image
              src={p.logo_url}
              alt={p.name}
              width={120}
              height={32}
              className="h-7 w-auto object-contain grayscale opacity-70 transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            <span className="whitespace-nowrap text-base font-semibold text-muted-foreground transition-colors hover:text-foreground">
              {p.name}
            </span>
          );
          return p.website_url ? (
            <a key={`${p.id}-${i}`} href={p.website_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
              {inner}
            </a>
          ) : (
            <span key={`${p.id}-${i}`} className="shrink-0">
              {inner}
            </span>
          );
        })}
      </div>
    </div>
  );
}
