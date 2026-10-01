"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CircleCheckBig,
  Download,
  Gift,
  Globe,
  Handshake,
  Laptop,
  Quote,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImpactHighlightRow, ImpactStatRow, PartnerRow } from "@/lib/types";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";

const IMG_WORKTOOL = "/assets/w3l-worktool-z1zeTkuT.jpeg";
const IMG_WORKTOOL_2 = "/assets/w3l-worktool2-ThPcpoRq.jpeg";
const IMG_LAPTOP = "/assets/w3l-laptop-C5PsUtev.jpg";
const IMG_OUTDOOR = "/assets/w3l-outdoor-BXHCHkOB.jpg";

const WAYS = [
  "Program sponsorship",
  "Event sponsorship",
  "Tool sponsorship",
  "Mentorship collaboration",
  "Ecosystem partnerships",
  "Speaker partnerships",
  "Community activations",
  "Talent and visibility initiatives",
];

const PACKAGES = [
  {
    icon: Gift,
    title: "Scholarship Partner",
    price: "$2,500",
    desc: "Funds scholarship seats for selected women in our programs.",
  },
  {
    icon: Wrench,
    title: "Work Tool Partner",
    price: "$3,000",
    desc: "Supports work tools for selected women builders — laptops, internet, software access.",
  },
  {
    icon: Calendar,
    title: "Event Series Sponsor",
    price: "$5,000–$10,000",
    desc: "Supports a themed event series — workshops, panels, demos, or community meetups.",
  },
  {
    icon: BookOpen,
    title: "Cohort / Track Sponsor",
    price: "$7,500",
    desc: "Supports a focused learning track or program experience within our cohort system.",
  },
  {
    icon: Globe,
    title: "Annual Ecosystem Partner",
    price: "$15,000–$30,000",
    desc: "Ongoing ecosystem support, visibility, scholarship sponsorship, and access.",
  },
  {
    icon: Handshake,
    title: "Custom Partnership",
    price: "Let's Talk",
    desc: "Have a specific idea for how you'd like to support? We're open to creative, tailored partnership arrangements.",
  },
];

const DEFAULT_STATS = [
  { stat: "21+", label: "Strategic partnerships established" },
  { stat: "68+", label: "Community collaborations & events" },
  { stat: "36+", label: "Hackathons & workshops hosted" },
  { stat: "$18K+", label: "Funding raised from partnerships" },
  { stat: "483+", label: "Women mentored through programs" },
  { stat: "40%", label: "Mentees secured opportunities in Web3" },
];

const DEFAULT_ORGANIZATIONS = [
  "Polygon",
  "Celo Foundation",
  "Yellow Card",
  "Filecoin",
  "SheCode Africa",
  "Nodo",
  "Ethereum Foundation",
  "Solana",
  "Starknet",
  "Base",
  "Cartesi",
  "Stellar / DSF Labs",
];

const RECIPIENT_QUOTES = [
  {
    quote:
      "Thank you so much @web3ladies — this means a whole lot to me. I got my worktool already!",
    name: "Comfort Olawale",
    context: "Work Tool Program Recipient",
  },
  {
    quote:
      "I got my inverter today, Christmas is setting in really well. Thank you @web3ladies.",
    name: "Ada Lovelace Jr.",
    context: "Work Tool Program Recipient, Dec 2022",
  },
  {
    quote:
      "I say a big thank you to @web3ladies and all their sponsors. May God richly bless you.",
    name: "Pamilerin Olusanmi",
    context: "Work Tool Program Recipient",
  },
];

type Highlight = {
  icon: LucideIcon;
  title: string;
  desc: string;
  report?: string;
  reportLabel?: string;
};

const DEFAULT_HIGHLIGHTS: Highlight[] = [
  {
    icon: Users,
    title: "Women Build Celo Hackathon",
    desc: "Partnered with Celo Foundation to organize the first-ever female-only hackathon for women in Africa — 300+ participants, 31 teams, 18 live demos.",
    report: "/reports/celo-hackathon-report.pdf",
    reportLabel: "Download Celo Hackathon Report",
  },
  {
    icon: Laptop,
    title: "Work Tool Assistance Program",
    desc: "Launched initiative to support 1,500 women by 2050 with laptops, inverters, and internet devices. Phase 1 distributed work tools to community members.",
    report: "/reports/web3ladies-impact-report.pdf",
    reportLabel: "Download Impact Report",
  },
  {
    icon: Award,
    title: "Yellow Card Partnership",
    desc: "Yellow Card teamed up with Web3Ladies to empower 500+ Nigerian women in tech through structured mentorship and learning programs.",
    report: "/reports/web3ladies-impact-report-2.pdf",
    reportLabel: "Download Partnership Report",
  },
  {
    icon: Zap,
    title: "Polygon Mentorship Collaboration",
    desc: "Partnered with Polygon in 2022 to enhance mentorship programs, providing structured blockchain engineering tracks for women builders.",
  },
];

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  users: Users,
  laptop: Laptop,
  award: Award,
  zap: Zap,
};

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function PartnerView({
  highlights,
  pastPartners,
  stats,
}: {
  highlights: ImpactHighlightRow[];
  pastPartners: PartnerRow[];
  stats: ImpactStatRow[];
}) {
  const [initialValues, setInitialValues] = useState<Record<string, string>>({});

  const highlightCards: Highlight[] =
    highlights.length > 0
      ? highlights.map((h) => ({
          icon: HIGHLIGHT_ICONS[h.icon ?? "users"] ?? Users,
          title: h.title,
          desc: h.description ?? "",
          report: h.report_url ?? undefined,
          reportLabel: h.report_label ?? undefined,
        }))
      : DEFAULT_HIGHLIGHTS;
  const organizations =
    pastPartners.length > 0 ? pastPartners.map((p) => p.name) : DEFAULT_ORGANIZATIONS;
  const statCards =
    stats.length > 0 ? stats.map((s) => ({ stat: s.value, label: s.label })) : DEFAULT_STATS;

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
            Partner with Web3Ladies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Support the next generation of women building across Web3, AI, and emerging
            technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="rounded-full px-8" onClick={() => scrollTo("partner-form")}>
              Become a Partner <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-primary/20"
              onClick={() => scrollTo("sponsor-packages")}
            >
              Sponsor a Seat
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why partner */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Why partner with us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Web3Ladies sits at the intersection of community, learning, opportunity, and
              impact. We partner with organizations, ecosystems, companies, and leaders who
              want to support women meaningfully — through access, exposure, practical tools,
              and high-quality programming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsor outcomes */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Sponsor outcomes, not just activity
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Partner with Web3Ladies to fund specific outcomes: scholarship seats, work tool
                support, event access, and visible pathways for women building in Web3 and
                emerging technology.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              <img
                src={IMG_WORKTOOL_2}
                alt="Dell laptops for Web3Ladies work tool program"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[3/4]"
              />
              <img
                src={IMG_WORKTOOL}
                alt="Power stations for Web3Ladies work tool program"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[3/4]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proof of impact */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Proof of impact
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real numbers from real partnerships. Here&apos;s what our collaborations have made
              possible.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-center space-y-1"
              >
                <p className="text-2xl sm:text-3xl font-display font-bold text-primary">{s.stat}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships in practice */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              What partnerships look like in practice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From hackathons and mentorship programs to work tool distribution — here&apos;s
              how partners have driven real outcomes with Web3Ladies.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {highlightCards.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <h.icon className="w-7 h-7 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                {h.report && (
                  <a
                    href={h.report}
                    download
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors pt-1"
                  >
                    <Download className="w-4 h-4" />
                    {h.reportLabel}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipient quotes */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              What our community says
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real feedback from women who received work tools and support through our
              sponsor-backed programs.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {RECIPIENT_QUOTES.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-4"
              >
                <Quote className="w-6 h-6 text-primary/40" />
                <p className="text-sm text-foreground leading-relaxed italic">&quot;{q.quote}&quot;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{q.name}</p>
                  <p className="text-xs text-muted-foreground">{q.context}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground">
              Organizations we&apos;ve worked with
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {organizations.map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground font-medium"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="sponsor-packages" className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-14"
          >
            Sponsorship packages
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                onClick={() => {
                  setInitialValues({ type: p.title });
                  scrollTo("partner-form");
                }}
              >
                <p.icon className="w-7 h-7 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                <p className="text-xl font-display font-bold text-primary">{p.price}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Select this package <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to work with us */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-10"
          >
            Ways to work with us
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {WAYS.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <CircleCheckBig className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground text-sm">{w}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What partnership makes possible */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground">
              What your partnership helps make possible
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your support helps create better access, stronger programs, practical learning
              opportunities, and more visible pathways for women building in emerging
              technologies.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            <motion.img
              src={IMG_WORKTOOL_2}
              alt="Dell laptops distributed through work tool program"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            />
            <motion.img
              src={IMG_LAPTOP}
              alt="Women working on laptops at Web3Ladies"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            />
            <motion.img
              src={IMG_OUTDOOR}
              alt="Web3Ladies community outdoor event"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
            />
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="partner-form" className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <ConfigForm formType="partner" initialValues={initialValues} />
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Let&apos;s build something meaningful together
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            If your organization cares about talent, inclusion, innovation, and the future of
            technology, we&apos;d love to explore partnership opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" onClick={() => scrollTo("partner-form")}>
              Become a Partner
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-primary/20"
              onClick={() => scrollTo("sponsor-packages")}
            >
              Fund the Work Tool Program
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
