"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CircleCheckBig,
  Code,
  Compass,
  Crown,
  Gift,
  Globe,
  Handshake,
  Heart,
  Layers,
  Lightbulb,
  Mic,
  Rocket,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FeaturedCard, FounderStoryRow, PartnerRow, SocialProofRow } from "@/lib/types";
import { fadeUp } from "./motion";
import { FeaturedSection } from "./featured-section";
import { PartnersMarquee } from "./partners-marquee";
import { TestimonialsSection } from "./testimonials-section";
import { SocialProofSection } from "./social-proof-section";
import { FounderStorySection } from "./founder-story-section";

const IMG_COMMUNITY = "/assets/w3l-community-CnAOSAwg.jpg";
const IMG_BUILDER = "/assets/w3l-builder-COStughb.jpg";
const IMG_TEAM = "/assets/w3l-team-DGAT43mi.jpg";
const IMG_CASUAL = "/assets/w3l-casual-3OiRhJqm.jpg";

const OFFERINGS = [
  {
    icon: Rocket,
    title: "Web3 x AI Venture Builder",
    desc: "A hands-on experience for women building future-facing careers, products, and ventures at the intersection of blockchain, AI, and the future of work.",
    href: "/venture-builder",
  },
  {
    icon: Wrench,
    title: "Worktool Grants",
    desc: "Sponsor-backed work tool support for selected women builders — laptops, internet, software access, and essential resources to keep building.",
    href: "/partner",
  },
  {
    icon: Calendar,
    title: "Events",
    desc: "Workshops, AMAs, masterclasses, meetups, and conversations that connect women to real ideas, real builders, and real opportunities.",
    href: "/events",
  },
  {
    icon: Heart,
    title: "Community",
    desc: "A support system for ambitious women navigating learning, transition, visibility, accountability, and growth in emerging technology.",
    href: "/community",
  },
  {
    icon: Users,
    title: "Cohorts",
    desc: "Our focused learning tracks are coming back and we want you in the room when they do. Drop your email and you'll be the first we call.",
    href: "/cohorts",
    comingSoon: true,
    comingSoonLabel: "Coming Back Soon",
    waitlistCta: "Save My Spot",
  },
  {
    icon: Crown,
    title: "Web3Ladies Circle",
    desc: "We're building something more intimate for women who are serious about going deeper. If that's you, we want you to know about it before anyone else does.",
    href: "/membership",
    comingSoon: true,
    comingSoonLabel: "Coming Soon",
    waitlistCta: "Put Me on the List",
  },
];

const AUDIENCE = [
  { icon: Compass, text: "Women exploring careers in blockchain, AI, and emerging technology" },
  { icon: Layers, text: "Early-career builders looking for structure, community, and direction" },
  { icon: Code, text: "Technical professionals growing into deeper specialization" },
  { icon: Lightbulb, text: "Founders and aspiring founders building future-facing products" },
  {
    icon: TrendingUp,
    text: "Women who already have a career in finance, law, healthcare, education, or anywhere else, and are ready to bring blockchain or AI into what they already know how to do",
  },
];

const DIFFERENTIATORS = [
  { icon: Globe, text: "We are future-focused — always preparing women for the future of work, opportunity, and impact" },
  { icon: Target, text: "We care about practical outcomes, not just motivational language" },
  { icon: Users, text: "We combine skills, mentorship, exposure, and community support" },
  { icon: Star, text: "We are building a space where women can learn, build, lead, and be seen" },
];

const PATHS = [
  {
    icon: Heart,
    title: "Join the Community",
    desc: "Free access to our global network of women learning and building in emerging technology.",
    href: "/community",
    cta: "Join Free",
  },
  {
    icon: Rocket,
    title: "Apply to Venture Builder",
    desc: "Our flagship paid program — build your MVP, grow your skills, and demo what you create.",
    href: "/venture-builder",
    cta: "Apply Now",
  },
  {
    icon: Gift,
    title: "Sponsor a Seat",
    desc: "Fund a scholarship seat and help widen access for women building in emerging tech.",
    href: "/partner",
    cta: "Sponsor",
  },
  {
    icon: Mic,
    title: "Host an Event",
    desc: "Partner with us to host a workshop, AMA, meetup, or community conversation for women in tech.",
    href: "/events#host",
    cta: "Host With Us",
  },
];

const STATS = [
  {
    value: "20,000+",
    label: "women reached",
    desc: "We've shown up in the feeds, inboxes, and communities of over twenty thousand women across Africa and the UAE. That reach is growing every week.",
  },
  {
    value: "4,700+",
    label: "community members",
    desc: "These are the women who chose to stay, joining our network, showing up to events, and building alongside each other in emerging technology.",
  },
  {
    value: "483+",
    label: "accepted and trained",
    desc: "We don't accept everyone. These are women who applied, were selected, and committed to structured learning through our cohort and venture builder programs.",
  },
  {
    value: "77+",
    label: "graduates",
    desc: "Women who went all the way, completing full program tracks and shipping real projects at the end.",
  },
  {
    value: "49+",
    label: "projects submitted",
    desc: "Real products. Real MVPs. Ideas that went from a conversation to something you can actually click on.",
  },
  {
    value: "50+",
    label: "events hosted",
    desc: "Workshops, AMAs, masterclasses, and meetups where we put women in the same room as the ideas and people that matter.",
  },
];

const NEWSLETTER_PERKS = [
  "First access to program openings and cohort announcements before we go public",
  "Event invites, workshop schedules, and AMA drops straight to your inbox",
  "Funding opportunities, grants, and ecosystem news curated for women builders",
  "Honest stories from women in our community who are building real things right now",
];

export function HomeView({
  featured,
  partners,
  socialProof,
  founder,
}: {
  featured: FeaturedCard[];
  partners: PartnerRow[];
  socialProof: SocialProofRow[];
  founder: FounderStoryRow | null;
}) {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
              >
                Build your career, product, or next chapter in{" "}
                <span className="text-primary">emerging technologies.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
              >
                We built Web3Ladies for women like you - curious about what&apos;s
                possible, ready to grow, and willing to build a future that feels
                truly your own. Whether you&apos;re just starting or already on your
                journey, we&apos;re here to help you learn, build, and move forward
                across blockchain, AI, and the future of work.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/venture-builder"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 group glow-purple")}
                >
                  Join the Venture Builder
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/partner"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "rounded-full px-8 border-rose/30 hover:bg-rose-light hover:text-foreground",
                  )}
                >
                  Partner With Us
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-2xl -m-2" />
              <img
                src={IMG_COMMUNITY}
                alt="Web3Ladies community at an event"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] relative"
              />
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card border border-rose/20 p-4 shadow-lg">
                <p className="text-2xl font-display font-bold text-primary">20,000+</p>
                <p className="text-xs text-muted-foreground">women reached across platforms</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-4 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[IMG_COMMUNITY, IMG_BUILDER, IMG_TEAM, IMG_CASUAL].map((src, i) => (
              <motion.div
                key={i}
                className="relative rounded-xl overflow-hidden group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <img
                  src={src}
                  alt="Web3Ladies event"
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/5 pointer-events-none rounded-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedSection items={featured} />

      {/* More than a community */}
      <section className="py-20 lg:py-28 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
              More than a community. <span className="text-primary">A launchpad</span> for
              women building what&apos;s next.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re helping women across Africa and the UAE learn, build, and lead
              across blockchain, AI, and adjacent emerging technologies.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through practical programs, mentorship, events, and community support, we
              help women move from curiosity to capability — and from capability to
              visible, real-world outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="py-20 lg:py-28 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
          <motion.div {...fadeUp} className="text-center mb-14 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Built with impact. <span className="text-primary">Growing with intention.</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 text-center hover:border-rose/30 transition-colors group"
              >
                <div className="text-3xl font-display font-bold text-primary">{s.value}</div>
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PartnersMarquee partners={partners} />

      {/* What we offer */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-display font-bold text-foreground text-center mb-14"
          >
            What we offer
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFERINGS.map((o, i) => {
              const comingSoon = !!o.comingSoon;
              const className = `relative block h-full rounded-2xl border border-border bg-card p-8 transition-all overflow-hidden ${comingSoon ? "cursor-default" : "hover:shadow-md hover:border-primary/20 group"}`;
              const body = (
                <>
                  <o.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                    {o.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{o.desc}</p>
                  {comingSoon && o.waitlistCta && (
                    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-auto">
                      <Input type="email" placeholder="Enter your email" className="rounded-full text-sm h-9" />
                      <Button type="submit" size="sm" className="rounded-full px-4 shrink-0 text-xs">
                        {o.waitlistCta}
                      </Button>
                    </form>
                  )}
                  {comingSoon && (
                    <span className="inline-block mt-3 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                      {o.comingSoonLabel}
                    </span>
                  )}
                </>
              );
              return (
                <motion.div
                  key={o.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {comingSoon ? (
                    <div className={className}>{body}</div>
                  ) : (
                    <Link href={o.href} className={className}>
                      {body}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Choose your path */}
      <section className="py-20 lg:py-28 px-6 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
          <motion.div {...fadeUp} className="text-center mb-14 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Choose your path
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATHS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={p.href}
                  className="block h-full rounded-2xl border border-border bg-card p-6 hover:shadow-md hover:border-rose/30 transition-all group text-center space-y-4"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  <span className="inline-block text-sm font-medium text-primary">{p.cta} →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Who this is for
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you are just starting out or already building, Web3Ladies is
              designed to meet you where you are and help you move forward with clarity.
            </p>
          </motion.div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {AUDIENCE.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <a.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{a.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Our flagship experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
                Web3 x AI Venture Builder
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Web3 x AI Venture Builder is for women who want more than passive
                learning. It is designed for practical growth — helping participants
                learn fast, build confidently, validate ideas, and create visible
                outcomes.
              </p>
              <Link
                href="/venture-builder"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 group")}
              >
                Explore the Venture Builder
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.img
              src={IMG_BUILDER}
              alt="Web3Ladies buildathon winners"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </section>

      {/* Access that multiplies */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp} className="space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Handshake className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Access that multiplies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Revenue from our premium programs helps fund scholarship seats, work tool
              support, and broader access for women building in emerging technology.
            </p>
            <Link
              href="/partner"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 border-primary/20")}
            >
              Learn About Sponsorship
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-display font-bold text-foreground text-center mb-12"
          >
            What makes us different
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <d.icon className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground leading-relaxed">{d.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to build */}
      <section className="py-20 lg:py-28 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto max-w-3xl text-center space-y-8 relative">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              Ready to build <span className="text-primary">what&apos;s next?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join a platform designed to help women move from curiosity to confidence —
              and from confidence to real-world outcomes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/venture-builder"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 glow-purple")}
              >
                Join the Venture Builder
              </Link>
              <Link
                href="/community"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full px-8 border-rose/30 hover:bg-rose-light",
                )}
              >
                Join Community
              </Link>
              <Link
                href="/partner"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full px-8 border-primary/20 hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FounderStorySection founder={founder} />
      <SocialProofSection items={socialProof} />
      <TestimonialsSection />

      {/* Newsletter */}
      <section className="py-20 lg:py-28 px-6 border-t border-rose/10 relative overflow-hidden">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <motion.div {...fadeUp} className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              We don&apos;t do generic newsletters. This one is built for you.
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We send things that actually matter to women building in emerging tech. Not
              noise, not filler. If you are serious about staying close to what is
              happening at the frontier, this is where you want to be.
            </p>
            <div className="text-left space-y-3 max-w-lg mx-auto">
              <p className="text-sm font-medium text-foreground">What you&apos;ll get:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {NEWSLETTER_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="rounded-full" />
              <Button type="submit" className="rounded-full px-6">
                I&apos;m In, Subscribe Free
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              We respect your inbox. No spam. Unsubscribe whenever you want.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
