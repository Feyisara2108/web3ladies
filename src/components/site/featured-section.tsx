"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Heart, Megaphone, Rocket, Star, Zap } from "lucide-react";
import type { FeaturedCard } from "@/lib/types";
import { LocalDate } from "./local-date";

const FALLBACK: FeaturedCard[] = [
  {
    type: "event",
    title: "Web3 x AI Venture Builder — Now Open",
    description:
      "Our flagship program is accepting applications. Build your MVP, grow your skills, and demo what you create.",
    href: "/venture-builder",
    cta: "Apply Now",
    badge: "Program",
    icon: "calendar",
    image: null,
  },
  {
    type: "initiative",
    title: "Worktool Grant Applications Open",
    description:
      "Apply or sponsor a work tool grant — laptops, internet, and software access for women builders who need it most.",
    href: "/partner",
    cta: "Learn More",
    badge: "Initiative",
    icon: "zap",
    image: null,
  },
  {
    type: "announcement",
    title: "Upcoming: Web3Ladies Community Meetup",
    description:
      "Join us for an evening of connection, learning, and real conversation with women building in emerging technology.",
    href: "/events",
    cta: "See Events",
    badge: "Event",
    icon: "megaphone",
    image: null,
  },
];

const ICONS = {
  calendar: Calendar,
  zap: Zap,
  megaphone: Megaphone,
  rocket: Rocket,
  heart: Heart,
  star: Star,
} as const;

export function FeaturedSection({ items }: { items: FeaturedCard[] }) {
  const cards = items.length > 0 ? items : FALLBACK;

  return (
    <section className="py-20 lg:py-28 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4"
        >
          <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            What&apos;s happening
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Featured
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with our latest programs, events, and announcements.
          </p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {cards.map((card, i) => {
            const Icon = ICONS[(card.icon ?? "calendar") as keyof typeof ICONS] ?? Calendar;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="min-w-[220px] max-w-[242px] snap-start shrink-0"
              >
                <Link
                  href={card.href ?? "#"}
                  className="group block h-full rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all"
                >
                  {card.image && (
                    <img src={card.image} alt={card.title} className="w-full aspect-[4/3] object-cover" />
                  )}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-[10px] font-medium text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full truncate">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {card.description ?? (
                        <>
                          {card.badge} —{" "}
                          <LocalDate
                            iso={card.eventDate!}
                            options={{ month: "short", day: "numeric", year: "numeric" }}
                          />
                        </>
                      )}
                    </p>
                    <span className="inline-flex items-center text-xs font-medium text-primary gap-1">
                      {card.cta}{" "}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
