"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheckBig, Code, Globe, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";
import { TestimonialsSection, type TestimonialCard } from "./testimonials-section";

const TRACKS = [
  {
    icon: Wallet,
    title: "Onchain Products, Payments, and Stablecoins",
    desc: "For women interested in wallets, payments, digital assets, stablecoin rails, consumer finance, and onchain product design.",
  },
  {
    icon: Code,
    title: "Smart Contracts and Protocol Engineering",
    desc: "For women pursuing technical depth in Solidity, protocol systems, security thinking, infrastructure, and blockchain engineering.",
  },
  {
    icon: Globe,
    title: "Ecosystem Growth, Community, and DevRel",
    desc: "For women building non-coding but high-impact careers in ecosystem growth, partnerships, community, developer relations, and education.",
  },
];

const HOW_IT_WORKS = [
  "Structured cohort-based learning",
  "Mentorship and expert guidance",
  "Practical exercises and accountability",
  "Peer support and community access",
  "Clear pathway toward action and outcomes",
];

const GRADUATE_TESTIMONIALS: TestimonialCard[] = [
  {
    highlight: "The cohort made me more eager to learn and gave me a roadmap to keep going.",
    quote:
      "Prior to the cohort I had tried learning web3 development 2 times but didn't remain consistent until I got into the cohort that provided me with a community to learn with and people to look up to.",
    name: "Amarachi",
    role: "Web3 Developer",
    category: "Cohort Graduate",
  },
  {
    highlight: "I knew nothing about Crypto. I never traded crypto in my life. Now I am here.",
    quote:
      "I had so many challenges but in the end, I bought my first coin during class. I also started saving in USDT. I am very grateful for the cohort.",
    name: "Amarachukwu",
    role: "Crypto/DeFi Enthusiast",
    category: "Cohort Graduate",
  },
  {
    highlight: "The mentors have deep knowledge of teaching technical courses.",
    quote:
      "I had the pleasure to be a mentee at Web3Ladies Cohort II for 4 months without prior knowledge of HTML, CSS, and JavaScript. The training helped me develop my organizational and technical skills along with personal development.",
    name: "Elizabeth",
    role: "Web Developer",
    category: "Cohort Graduate",
  },
];

export function CohortsView() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Coming Back Soon
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
          >
            Cohorts built for where Web3 is headed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Focused mentorship tracks for women building careers and confidence across the
            most relevant paths shaping the future of Web3.
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.p {...fadeUp} className="text-muted-foreground leading-relaxed text-lg">
            Not everyone needs the same roadmap. Our cohorts are designed around real
            pathways, real market shifts, and real career possibilities within Web3.
          </motion.p>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRACKS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 space-y-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <t.icon className="w-8 h-8 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-10"
          >
            How it works
          </motion.h2>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((text, i) => (
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
      </section>

      <TestimonialsSection
        testimonials={GRADUATE_TESTIMONIALS}
        heading="What our cohort graduates say"
        highlightWord="graduates"
        showCTA={false}
      />

      {/* Closing */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Find the pathway that fits your next chapter
          </h2>
          <Link
            href="/bootcamp"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 group")}
          >
            Join a Cohort
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
