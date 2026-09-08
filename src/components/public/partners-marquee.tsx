import Image from "next/image";
import type { Partner } from "@/lib/types";

/**
 * Partner logo strip. Renders the logo image when available, otherwise the
 * partner name as a text chip (graceful fallback before logos are uploaded).
 */
export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {partners.map((p) => {
        const inner = p.logo_url ? (
          <Image
            src={p.logo_url}
            alt={p.name}
            width={120}
            height={40}
            className="h-8 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ) : (
          <span className="text-base font-semibold text-muted-foreground transition hover:text-foreground">
            {p.name}
          </span>
        );
        return p.website_url ? (
          <a key={p.id} href={p.website_url} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <span key={p.id}>{inner}</span>
        );
      })}
    </div>
  );
}
