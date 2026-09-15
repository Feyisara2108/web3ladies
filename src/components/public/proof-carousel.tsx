"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Trophy,
} from "lucide-react";
import type { SVGProps } from "react";
import type { SocialProof } from "@/lib/types";

// X (Twitter) glyph — lucide removed brand icons, so inline it.
function XGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.2-6.82-5.96 6.82H1.7l7.73-8.84L1.55 2.25h6.83l4.71 6.23 5.15-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
    </svg>
  );
}

/**
 * Proof-of-work carousel: horizontally scrollable cards styled as embedded
 * social posts (avatar/handle header, post text, media, engagement row),
 * with the next card peeking at the edge, draggable (native scroll + snap)
 * and arrow controls.
 *
 * NOTE: real engagement counts, video embeds, and a link-preview card are
 * pending source assets/data; the engagement row is presentational for now.
 */
export function ProofCarousel({ items }: { items: SocialProof[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {items.map((s) => (
          <article
            key={s.id}
            className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:w-[60%] lg:w-[38%]"
          >
            {/* Post header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="size-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Web3Ladies</div>
                  {s.category && (
                    <div className="text-xs text-muted-foreground">{s.category}</div>
                  )}
                </div>
              </div>
              <XGlyph className="size-4 shrink-0 text-muted-foreground" />
            </div>

            {/* Post text */}
            <p className="text-sm leading-relaxed">{s.title}</p>

            {/* Media */}
            {s.image_url && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
                <Image src={s.image_url} alt={s.title} fill sizes="(max-width:640px) 85vw, (max-width:1024px) 60vw, 38vw" className="object-cover" />
              </div>
            )}

            {/* Engagement row */}
            <div className="mt-1 flex items-center justify-between text-muted-foreground">
              <MessageCircle className="size-4" />
              <Repeat2 className="size-4" />
              <Heart className="size-4" />
              <Bookmark className="size-4" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollBy(-1)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollBy(1)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
