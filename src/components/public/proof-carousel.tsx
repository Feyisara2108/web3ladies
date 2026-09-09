"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SocialProof } from "@/lib/types";

/**
 * Proof-of-work carousel: horizontally scrollable cards with the next card
 * peeking at the edge, draggable (native scroll + snap) with arrow controls.
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
          <div
            key={s.id}
            className="w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card sm:w-[60%] lg:w-[38%]"
          >
            {s.image_url && (
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image src={s.image_url} alt={s.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-2 p-5">
              {s.category && <Badge className="w-fit">{s.category}</Badge>}
              <p className="text-sm font-medium leading-relaxed">{s.title}</p>
            </div>
          </div>
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
