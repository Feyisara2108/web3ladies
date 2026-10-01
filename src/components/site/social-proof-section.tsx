"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import type { SocialProofRow } from "@/lib/types";

const FALLBACK = [
  {
    image: "/assets/celo-hackathon-win-DXkh0P2H.jpg",
    caption: "Nofisat's team won a prize at the Celo MiniPay Hack",
    tag: "Hackathon Win",
  },
  {
    image: "/assets/worktool-laptop-CC7TtD_m.jpg",
    caption: "Nofisat received her HP laptop through our Worktool Program",
    tag: "Worktool Grant",
  },
  {
    image: "/assets/web3lagos-win-DQTmc7vv.jpg",
    caption: "Amarachiugwu's team won $1,500 at Web3 Lagos Conference",
    tag: "Hackathon Win",
  },
  {
    image: "/assets/siwe-workshop-gyz5A3vU.jpg",
    caption: "Amarachiugwu created a SIWE tutorial after a Web3Ladies workshop",
    tag: "Workshop Impact",
  },
];

/** "Proof of work" carousel. DB rows replace the defaults only when one has an image. */
export function SocialProofSection({ items }: { items: SocialProofRow[] }) {
  const cards = items.some((i) => i.image_url)
    ? items.map((i) => ({
        image: i.image_url ?? "",
        caption: i.caption,
        tag: i.tag ?? "Community Win",
      }))
    : FALLBACK;

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14 space-y-4"
        >
          <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Proof of work
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Women in our community are <span className="text-primary">winning</span>
          </h2>
          <p className="text-muted-foreground">
            Real posts. Real wins. Straight from the women building with us.
          </p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[300px] md:min-w-[340px] snap-start shrink-0 group"
            >
              <div className="rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.caption}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {card.tag}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
