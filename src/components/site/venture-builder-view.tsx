"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheckBig, Shield, Sparkles, Trophy, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";

const IMG_WINNERS = "/assets/w3l-winners-Cd7D9yXO.jpg";
const IMG_WOMEN_GROUP = "/assets/w3l-women-group-UPu09Eav.jpg";

const MODULES = [
  {
    title: "Foundations",
    desc: "Understanding the current landscape of Web3, AI, onchain products, automation, and future-of-work opportunities.",
  },
  {
    title: "Problem Selection",
    desc: "How to identify real-world problems worth solving and map them to emerging technology opportunities.",
  },
  {
    title: "AI x Web3 Opportunity Design",
    desc: "Exploring use cases across stablecoins, onchain identity, creator tools, fintech, automation, digital ownership, communities, and intelligent products.",
  },
  {
    title: "Build and Validate",
    desc: "Designing MVPs, validating ideas quickly, and using tools that help founders move faster.",
  },
  {
    title: "Go-to-Market Thinking",
    desc: "Positioning, audience clarity, traction strategy, and storytelling for adoption.",
  },
  {
    title: "Demo and Visibility",
    desc: "Showcasing what you built, what you learned, and where you are going next.",
  },
];

const WHO_ITS_FOR = [
  "Aspiring founders and venture-minded builders",
  "Women exploring product ideas in AI and Web3",
  "Technical professionals expanding into new frontiers",
  "Career pivoters ready to build instead of just watch",
  "Community members who want structure, accountability, and visible outcomes",
];

const BENEFITS = [
  "Practical live sessions",
  "Builder worksheets and resources",
  "Mentorship and feedback",
  "Accountability and peer support",
  "Exposure to real use cases and emerging trends",
  "Opportunity to demo ideas and outcomes",
];

const HIGHLIGHTS = [
  { icon: Shield, text: "Application-based — limited seats per cohort" },
  { icon: Users, text: "Cohort-based — learn with a curated peer group" },
  { icon: Sparkles, text: "Scholarship seats available for qualifying applicants" },
  { icon: Trophy, text: "Demo Day showcase — present what you built" },
];

const PRICING = [
  { label: "Standard Price", price: "$549+", note: "Starting standard price" },
  { label: "Early Bird", price: "$349", note: "Limited-time offer" },
  {
    label: "Discounted Standard",
    price: "$149",
    note: "Awarded based on need and available sponsorship",
  },
  {
    label: "Discounted Early Bird",
    price: "$99",
    note: "Awarded based on need and available sponsorship",
  },
];

export function VentureBuilderView() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                  Flagship Program — 6 Weeks — Limited Seats
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
              >
                Web3 × AI Venture Builder
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                A high-conviction, application-based program for women building
                future-ready careers, products, and opportunities across Web3, AI, and
                the future of work.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() =>
                    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link
                  href="/partner"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "rounded-full px-8 border-primary/20",
                  )}
                >
                  Sponsor a Seat
                </Link>
              </motion.div>
            </div>
            <motion.img
              src={IMG_WINNERS}
              alt="Web3Ladies buildathon winners"
              className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] hidden lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 px-6 bg-section-alt border-y border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border"
              >
                <h.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{h.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="space-y-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              What this program is about
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This is not a theory-heavy program built to impress people on paper. It is
              a practical bootcamp for women who want to understand where technology is
              going and build something meaningful within it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you want to launch a product, test an idea, strengthen your
              technical edge, or build confidence in emerging technology, this experience
              is designed to help you move with more clarity and momentum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 {...fadeUp} className="text-3xl font-display font-bold text-foreground mb-10">
                Who it&apos;s for
              </motion.h2>
              <div className="space-y-3">
                {WHO_ITS_FOR.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <CircleCheckBig className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.img
              src={IMG_WOMEN_GROUP}
              alt="Web3Ladies group event"
              className="rounded-2xl shadow-lg w-full object-cover aspect-square hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-14"
          >
            Program modules
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-foreground">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What participants get */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-10"
          >
            What participants get
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {BENEFITS.map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <CircleCheckBig className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Investment
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium revenue helps fund scholarship seats and broader access for women
              building in emerging technology.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-border bg-card overflow-hidden mb-8"
          >
            <div className="divide-y divide-border">
              {PRICING.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-5 sm:p-6">
                  <div className="space-y-1">
                    <span className="text-foreground font-medium">{p.label}</span>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {p.price}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold text-foreground">
                Scholarship Seats Available
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fully or partially sponsored — awarded based on need and available
              sponsorship from our partners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-foreground">
              What success looks like
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By the end of the program, participants should leave with stronger clarity,
              sharper thinking, a validated idea or working concept, deeper confidence, and
              a more visible next step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <ConfigForm formType="venture_builder" />
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Ready to build with intention?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Join the next Web3 × AI Venture Builder and start turning curiosity into
            capability.
          </p>
        </div>
      </section>
    </div>
  );
}
