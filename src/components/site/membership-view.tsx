"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  Crown,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";

const BENEFITS = [
  {
    icon: Calendar,
    title: "Monthly private session",
    desc: "Exclusive live sessions with builders, operators, and industry leaders.",
  },
  {
    icon: MessageCircle,
    title: "Office hours / AMA",
    desc: "Regular access to ask questions, get feedback, and think through challenges.",
  },
  {
    icon: Briefcase,
    title: "Curated opportunity board",
    desc: "Jobs, grants, partnerships, and ecosystem opportunities — filtered for relevance.",
  },
  {
    icon: Users,
    title: "Accountability pod access",
    desc: "Small-group accountability to help you stay consistent and focused.",
  },
  {
    icon: BookOpen,
    title: "Member directory",
    desc: "Connect with other serious women builders across Africa, the UAE, and beyond.",
  },
  {
    icon: Zap,
    title: "Members-only networking",
    desc: "Private channels and curated introductions within the Web3Ladies ecosystem.",
  },
  {
    icon: Crown,
    title: "Select partner perks",
    desc: "Exclusive access to tools, discounts, and partner benefits.",
  },
];

const PRICING = [
  { label: "Founding Price", price: "$199/year", note: "Founding member rate" },
  {
    label: "Standard Price",
    price: "$20/month or $249/year",
    note: "Main ongoing membership price",
  },
  {
    label: "Scholarship / Discounted Founding",
    price: "$79/year",
    note: "Awarded based on need and available sponsorship",
  },
  {
    label: "Scholarship / Discounted Standard",
    price: "$10/month or $99/year",
    note: "Awarded based on need and available sponsorship",
  },
];

export function MembershipView() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Coming Soon — Founding Members First
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
          >
            Web3Ladies Circle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            A curated membership for women serious about building with more clarity,
            stronger support, and better access.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() =>
                document.getElementById("membership-apply")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Apply for Founding Membership <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* More than a membership */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              More than a membership
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This is not a passive community membership. It is a sharper room for women who
              want consistency, curated access, accountability, and proximity to
              opportunities, mentors, and peers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-14"
          >
            What Circle members get
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <b.icon className="w-7 h-7 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Membership Pricing
            </h2>
            <p className="text-muted-foreground">
              Lock in the founding rate. Pricing will increase after this enrollment window.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {PRICING.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-5 sm:p-6">
                  <div className="space-y-1">
                    <span className="text-foreground font-medium">{p.label}</span>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </div>
                  <span className="text-xl font-display font-bold text-foreground">{p.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Not for everyone */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-foreground">
              Not for everyone. Built for women ready to do the work.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Circle is for women who are past browsing and ready for action. If you want
              structured support, real accountability, curated access, and a network that
              keeps you moving — this is your room.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Apply */}
      <section id="membership-apply" className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-2xl">
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <ConfigForm formType="membership" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
