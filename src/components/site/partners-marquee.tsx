"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import type { PartnerRow } from "@/lib/types";

const FALLBACK = [
  { name: "Polygon", logo: "/assets/polygon-2zd062MT.png" },
  { name: "Celo", logo: "/assets/celo-DCHEvpCA.png" },
  { name: "Solana", logo: "/assets/solana-DIiB-o-r.png" },
  { name: "Yellow Card", logo: "/assets/yellowcard-DWXjHJ-Y.png" },
  { name: "Nodo", logo: "/assets/nodo.png" },
  { name: "Ethereum Foundation", logo: "/assets/ethereum-foundation-DLDjYPx9.png" },
];

/** "With these partners" logo marquee. Uses DB supporters only when they have logos. */
export function PartnersMarquee({ partners }: { partners: PartnerRow[] }) {
  const logos = partners.some((p) => p.logo_url)
    ? partners.filter((p) => p.logo_url).map((p) => ({ name: p.name, logo: p.logo_url! }))
    : FALLBACK;

  return (
    <section className="py-16 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-2xl sm:text-3xl font-display font-bold text-foreground mb-3"
        >
          With these partners
        </motion.h2>
        <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto">
          We collaborate with ecosystem partners, mentors, and organizations
          committed to expanding access and opportunity for women building in
          emerging tech.
        </p>
      </div>
      <div className="relative mt-8 group">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex items-center mx-10 flex-shrink-0">
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
