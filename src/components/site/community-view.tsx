"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { ArrowRight, CircleCheckBig, Eye, Heart, Shield, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";
import { TestimonialsSection, type TestimonialCard } from "./testimonials-section";

const IMG_COMMUNITY = "/assets/w3l-community-CnAOSAwg.jpg";

const INSIDE = [
  "Real conversations",
  "Encouragement without gatekeeping",
  "Opportunities and ecosystem updates",
  "Peer accountability",
  "Mentorship moments",
  "A network of women building in public and growing on purpose",
];

const VALUES = [
  { icon: Shield, label: "Access" },
  { icon: Target, label: "Practical growth" },
  { icon: Sparkles, label: "Bold learning" },
  { icon: Users, label: "Collaboration" },
  { icon: Eye, label: "Visibility" },
  { icon: Heart, label: "Real-world outcomes" },
];

const COMMUNITY_TESTIMONIALS: TestimonialCard[] = [
  {
    highlight: "Web3Ladies gave me a community to learn with and people to look up to.",
    quote:
      "Prior to the cohort I had tried learning web3 development 2 times but didn't remain consistent. The community made me more eager to learn and provided the support I needed.",
    name: "Amarachi",
    role: "Web3 Developer",
    category: "Community",
  },
  {
    highlight:
      "I say a big thank you to @web3ladies and all their sponsors. May God richly bless you.",
    quote:
      "The support from this community is genuine. From the programs to the people, everything is designed to make sure no woman is left behind.",
    name: "Olusanmi Pamilerin",
    role: "Community Member",
    category: "Community",
  },
  {
    highlight:
      "I can gladly say I'm a community-taught solidity developer, thanks to Web3Ladies!",
    quote:
      "I have witnessed sporadic growth in my tech journey and this is owing to the amazing mentorship Web3Ladies provided me. The community keeps you going.",
    name: "Oluwadamilola",
    role: "Solidity Developer",
    category: "Community",
  },
];

export function CommunityView() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMG_COMMUNITY} alt="Web3Ladies community group" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
          >
            A community for women building with courage, clarity, and support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Web3Ladies is a home for women learning, building, transitioning, and leading
            across Web3, AI, and adjacent emerging technologies.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
            >
              Join Community <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why community matters */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Why community matters
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Too many women try to navigate emerging technology in isolation — learning
              quietly, doubting themselves, second-guessing their next step, and feeling
              like everyone else knows more. Web3Ladies exists to change that.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is a space for support, accountability, access, and becoming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inside the community */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-10"
          >
            Inside the community
          </motion.h2>
          <div className="space-y-3">
            {INSIDE.map((text, i) => (
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

      {/* Values */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
          >
            Our values
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 text-center space-y-3"
              >
                <v.icon className="w-6 h-6 text-primary mx-auto" />
                <p className="font-display font-semibold text-foreground">{v.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <ConfigForm formType="community" />
          </motion.div>
        </div>
      </section>

      <TestimonialsSection
        testimonials={COMMUNITY_TESTIMONIALS}
        heading="What our community members say"
        highlightWord="community"
        showCTA={false}
      />

      {/* Closing */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            You do not have to figure it all out alone
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Join a community built to help women keep learning, keep building, and keep
            becoming.
          </p>
        </div>
      </section>
    </div>
  );
}
