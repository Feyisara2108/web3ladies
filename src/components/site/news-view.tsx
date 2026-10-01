"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, Calendar, Globe, Megaphone, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "./motion";

const TOPICS = [
  { icon: Megaphone, label: "Web3Ladies updates" },
  { icon: BookOpen, label: "Program announcements" },
  { icon: Calendar, label: "Event recaps" },
  { icon: Globe, label: "Ecosystem insights" },
  { icon: Briefcase, label: "Career stories" },
  { icon: Sparkles, label: "AI x Web3 commentary" },
  { icon: Newspaper, label: "Opportunities and resources" },
];

export function NewsView() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
          >
            News, insights, and what&apos;s shaping the future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Stay connected to Web3Ladies updates, ecosystem trends, community stories, and
            practical insights across blockchain, AI, and the future of work.
          </motion.p>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
          >
            What we cover
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {TOPICS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5 text-center space-y-3 hover:border-primary/20 transition-colors"
              >
                <t.icon className="w-6 h-6 text-primary mx-auto" />
                <p className="text-sm font-medium text-foreground">{t.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-dashed border-border bg-card p-12 space-y-4"
          >
            <Newspaper className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-display font-semibold text-lg text-foreground">
              Stories and insights coming soon
            </h3>
            <p className="text-sm text-muted-foreground">
              We do not just want our community to participate in the future. We want them
              to understand it, shape it, and stay ahead of it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Get updates that actually help you grow
            </h2>
            <p className="text-sm text-muted-foreground">
              Subscribe for program updates, event announcements, ecosystem insights, and
              community opportunities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="rounded-full" />
              <Button type="submit" className="rounded-full px-6">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
