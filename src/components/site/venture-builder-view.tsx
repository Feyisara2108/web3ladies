"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COHORT, type CohortPlan } from "@/lib/venture-cohort";
import { ConfigForm } from "./config-form";
import { useCountdown } from "./venture/countdown";

const IMG_FOUNDER = "/assets/founder-oluchi-BnQV3JEa.png";

/** Deep ink background and a lighter purple that reads well on it. */
const INK = "bg-[hsl(252_30%_9%)]";
const LILAC = "text-[hsl(262_90%_80%)]";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const LOOP = [
  {
    title: "Demonstration",
    desc: "A mentor works through the step live on a real example project.",
  },
  {
    title: "Guided build",
    desc: "You do the same step on your own product, right there in the session.",
  },
  {
    title: "Independent application",
    desc: "You keep building between sessions, with weekly deliverables to keep you moving.",
  },
  {
    title: "Feedback",
    desc: "Mentors review your work and unblock you before the next class.",
  },
];

const PHASES = [
  {
    weeks: "Weeks 1–2",
    span: "lg:col-span-2",
    bar: "bg-primary/15 text-primary",
    title: "Foundations",
    desc: "Get clear before you build: how AI and Web3 are changing products, prompting for product work, and choosing your idea.",
    leaveWith: ["A chosen idea and early direction", "Practical prompting skills", "Fluency in the tools you'll use to the end"],
  },
  {
    weeks: "Weeks 3–4",
    span: "lg:col-span-2",
    bar: "bg-primary/35 text-primary",
    title: "Explore and design",
    desc: "Turn the idea into a plan: validate the problem, define your users, and map the flows and logic of your product.",
    leaveWith: ["A validated problem statement", "Clear users and user flows", "An MVP build plan"],
  },
  {
    weeks: "Weeks 5–8",
    span: "lg:col-span-4",
    bar: "bg-primary text-primary-foreground",
    title: "Build and ship",
    desc: "Build your MVP live alongside the mentors, test it with real users, and improve it until it works.",
    leaveWith: ["A working MVP or prototype", "Feedback from at least 5 real users", "A portfolio-ready project"],
  },
];

const WEEK = [
  { day: "Mon", what: "Resources and deliverables drop", live: false },
  { day: "Tue", what: "Live build, 5–7 PM WAT", live: true },
  { day: "Wed", what: "Build on your own", live: false },
  { day: "Thu", what: "Build on your own", live: false },
  { day: "Fri", what: "Live build, 5–7 PM WAT", live: true },
  { day: "Sat", what: "Office hours, when scheduled", live: false },
  { day: "Sun", what: "Rest", live: false },
];

const PLATFORMS = [
  { name: COHORT.schedule.platform, use: "Live classes and Demo Day" },
  { name: "Learning hub", use: "Recordings, resources and assignments" },
  { name: "Discord", use: "Community, discussion and mentor support" },
  { name: "Email", use: "Official announcements" },
];

const OUTCOMES = [
  { title: "A working MVP", desc: "A functional product or prototype with its core features in place." },
  { title: "Real user feedback", desc: "Tested with at least five people, and improved based on what they said." },
  { title: "Skills you keep", desc: "Prompting, AI-assisted building, user flows and product thinking." },
  { title: "A community behind you", desc: "Graduate at Demo Day and stay part of the Web3Ladies ecosystem." },
];

const INCLUDED = [
  `${COHORT.schedule.weeks * 2} live build sessions`,
  "Recordings of every session",
  "Resources and weekly deliverables",
  "Mentor feedback and office hours",
  "Community and support on Discord",
  "Demo Day and graduation",
];

const KEY_DATES = [
  { label: "Applications close", date: COHORT.dates.registrationCloses },
  { label: "Classes start", date: COHORT.dates.classesStart },
  { label: "Live sessions", date: `Tue & Fri, 5–7 PM WAT` },
  { label: "Demo Day", date: COHORT.dates.demoDay },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You'll build with a small set of AI and no-code tools, introduced in the first week and used all the way to your MVP.",
  },
  {
    q: "Not sure what to build yet?",
    a: "That's fine. The first two weeks help you choose and sharpen an idea. A few examples: a savings app for market traders, an AI study buddy for students, a booking tool for local businesses, or an AI assistant for small business owners.",
  },
  {
    q: "How much time will it take each week?",
    a: `Two live sessions a week (${COHORT.schedule.days}, ${COHORT.schedule.time}) on ${COHORT.schedule.platform}, plus time for your weekly deliverables.`,
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded. Recordings, resources and assignments are on the Web3Ladies learning hub, so you can catch up and send in your reflections.",
  },
  {
    q: "Who are the mentors?",
    a: "A Lead Mentor runs the sessions, guides the builds and gives direct feedback on your product. A Support Mentor helps with troubleshooting, accountability and questions between classes. We'll introduce them before the cohort starts.",
  },
  {
    q: "Do I have to build something with Web3?",
    a: "No. Web3 is optional. We add it only where it improves your product, for example for ownership, payments, identity or transparency.",
  },
  {
    q: "What do I need to do to graduate?",
    a: "Attend consistently (or watch the recordings), complete the weekly deliverables, ship a working MVP or prototype, test it with at least 5 real users, and take part in Demo Day.",
  },
  {
    q: "When do I pay, and when is my seat confirmed?",
    a: "Right after you apply. Choose your seat, submit your application and complete payment. Your seat is confirmed as soon as your payment is received.",
  },
];

function DaysLeft({ className = "" }: { className?: string }) {
  const t = useCountdown(COHORT.registrationCloses);
  if (!t) return null;
  if (t.closed) return <span className={className}>Applications for this cohort have closed.</span>;
  return (
    <span className={className}>
      {t.days} {t.days === 1 ? "day" : "days"} left to apply
    </span>
  );
}

function PaymentStep({ plan }: { plan: CohortPlan }) {
  return (
    <div className="space-y-6">
      <BadgeCheck className="w-10 h-10 text-primary" />
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-foreground">Application received</h3>
        <p className="text-muted-foreground">
          One last step: complete your payment and your seat in {COHORT.name} is confirmed.
        </p>
      </div>
      <div className="flex items-baseline justify-between border-y border-border py-4">
        <p className="font-medium text-foreground">{plan.name}</p>
        <p className="text-2xl font-display font-bold text-foreground">{plan.price}</p>
      </div>
      {plan.paymentUrl ? (
        <a
          href={plan.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground h-11 px-8 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CreditCard className="w-4 h-4" /> Pay {plan.price}
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you a secure payment link shortly. Your seat is confirmed once payment is
          received.
        </p>
      )}
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-sm font-medium mb-4 ${light ? LILAC : "text-primary"}`}>{children}</p>
  );
}

export function VentureBuilderView() {
  const [planId, setPlanId] = useState<string>(COHORT.pricing[0].id);
  const [submitted, setSubmitted] = useState(false);
  const plan = COHORT.pricing.find((p) => p.id === planId) ?? COHORT.pricing[0];
  const planValue = useMemo(() => ({ plan: `${plan.name} (${plan.price})` }), [plan]);

  const choosePlan = (id: string) => {
    setPlanId(id);
    scrollTo("apply");
  };

  return (
    <div>
      {/* Hero */}
      <section className={`${INK} text-white pt-36 pb-14 lg:pt-48 lg:pb-16 px-6`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className={`text-sm font-medium ${LILAC}`}>
              Web3 × AI Venture Builder · {COHORT.name}, {COHORT.startMonth}
            </p>
            <h1 className="mt-6 text-5xl sm:text-7xl lg:text-[7.5rem] font-display font-bold leading-[0.95] tracking-tight">
              Stop planning.
              <br />
              <span className={LILAC}>Start shipping.</span>
            </h1>
            <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-end">
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
                An 8-week live program for women with an idea. Build it with AI and no-code tools
                alongside our mentors, twice a week, and finish with a working product real people
                have used.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-end">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 text-base"
                  onClick={() => scrollTo("apply")}
                >
                  Apply for {COHORT.name}
                </Button>
                <button
                  type="button"
                  onClick={() => scrollTo("pricing")}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  See pricing <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-y border-white/10"
          >
            {KEY_DATES.map((d) => (
              <div key={d.label} className={`${INK} py-5 lg:py-6 pr-4 [&:nth-child(even)]:pl-5 lg:[&:not(:first-child)]:pl-6`}>
                <dt className="text-sm text-white/50">{d.label}</dt>
                <dd className="mt-1 font-medium text-white">{d.date}</dd>
              </div>
            ))}
          </motion.dl>
          <DaysLeft className="block mt-5 text-sm text-white/50" />
        </div>
      </section>

      {/* How you learn */}
      <section className="py-20 lg:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow>How you learn</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              No watching tutorials. You build in every session.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every class follows the same loop. And you use one lean set of tools from the first
              week to Demo Day: fewer tools, deeper fluency, more shipping.
            </p>
          </motion.div>
          <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {LOOP.map((s, i) => (
              <motion.li
                key={s.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-background p-7 lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-bold text-primary/25 tabular-nums">
                    0{i + 1}
                  </span>
                  {i < LOOP.length - 1 && (
                    <ArrowRight className="hidden lg:block w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
                <h3 className="mt-6 font-display font-semibold text-lg text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* The 8 weeks */}
      <section className="py-20 lg:py-32 px-6 bg-section-alt">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow>The 8 weeks</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              From an idea to a product people have used.
            </h2>
          </motion.div>

          <div className="mt-14">
            <div className="hidden lg:grid grid-cols-8 gap-2 mb-3">
              {Array.from({ length: COHORT.schedule.weeks }, (_, i) => (
                <p key={i} className="text-xs font-medium text-muted-foreground tabular-nums">
                  Week {i + 1}
                </p>
              ))}
            </div>
            <div className="grid lg:grid-cols-8 gap-x-2 gap-y-12">
              {PHASES.map((p, i) => (
                <motion.div
                  key={p.title}
                  {...reveal}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={p.span}
                >
                  <div className={`rounded-full px-5 py-2.5 text-sm font-medium ${p.bar}`}>
                    {p.weeks}
                  </div>
                  <div className="mt-6 lg:pr-8">
                    <h3 className="font-display font-bold text-2xl text-foreground">{p.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{p.desc}</p>
                    <p className="mt-6 text-sm font-medium text-foreground">You leave with</p>
                    <ul className="mt-3 space-y-2">
                      {p.leaveWith.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p
              {...reveal}
              className="mt-14 border-t border-border pt-6 text-foreground font-medium"
            >
              Then: Demo Day and graduation, {COHORT.dates.demoDay}.
            </motion.p>
          </div>
        </div>
      </section>

      {/* A week */}
      <section className="py-20 lg:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow>A week in the program</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              Two live sessions. Real progress every week.
            </h2>
          </motion.div>
          <motion.ol
            {...reveal}
            className="mt-14 grid grid-cols-1 sm:grid-cols-7 gap-2"
          >
            {WEEK.map((d) => (
              <li
                key={d.day}
                className={`rounded-2xl p-4 sm:p-5 flex sm:flex-col gap-4 sm:gap-10 sm:min-h-44 ${
                  d.live ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                <span
                  className={`w-10 sm:w-auto font-display font-bold ${d.live ? "" : "text-foreground"}`}
                >
                  {d.day}
                </span>
                <span
                  className={`text-sm leading-snug ${d.live ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                >
                  {d.what}
                </span>
              </li>
            ))}
          </motion.ol>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 border-t border-border pt-10">
            {PLATFORMS.map((p) => (
              <div key={p.name}>
                <p className="font-display font-semibold text-foreground">{p.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className={`${INK} text-white py-20 lg:py-32 px-6`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-3xl">
            <Eyebrow light>Where you&apos;ll be in 8 weeks</Eyebrow>
            <h2 className="text-4xl sm:text-5xl font-display font-bold leading-[1.05] tracking-tight">
              You leave with a product, not a certificate.
            </h2>
          </motion.div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {OUTCOMES.map((o, i) => (
              <motion.div
                key={o.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-t border-white/15 pt-6"
              >
                <p className={`font-display text-5xl font-bold tabular-nums ${LILAC}`}>0{i + 1}</p>
                <h3 className="mt-6 font-display font-semibold text-xl">{o.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 lg:py-32 px-6">
        <motion.div
          {...reveal}
          className="container mx-auto max-w-4xl grid sm:grid-cols-[160px_1fr] gap-8 sm:gap-12 items-center"
        >
          <img
            src={IMG_FOUNDER}
            alt="Oluchi Enebeli, Founder of Web3Ladies"
            className="w-32 sm:w-40 rounded-2xl object-cover aspect-[3/4]"
          />
          <figure className="space-y-5">
            <blockquote className="text-2xl sm:text-4xl font-display font-semibold text-foreground leading-snug tracking-tight">
              “If the room did not naturally make space for more women, then I would help build a
              bigger room.”
            </blockquote>
            <figcaption className="text-sm text-muted-foreground">
              Oluchi Enebeli, Founder, Web3Ladies
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 px-6 bg-section-alt scroll-mt-20">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_1fr_1fr] gap-6 items-stretch">
          <motion.div {...reveal} className="lg:pr-6 pb-6 lg:pb-0">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="text-4xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              Reserve your seat.
            </h2>
            <p className="mt-4 text-muted-foreground">Both seats include everything:</p>
            <ul className="mt-5 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          {COHORT.pricing.map((p, i) => (
            <motion.div
              key={p.id}
              {...reveal}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-3xl p-8 lg:p-10 flex flex-col ${
                p.featured
                  ? `${INK} text-white`
                  : "border border-border bg-background text-foreground"
              }`}
            >
              <p className="font-display font-semibold text-xl">{p.name}</p>
              <p className={`mt-1 text-sm ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>
                {p.note}
              </p>
              <p className="mt-10 mb-10 text-6xl font-display font-bold tracking-tight">{p.price}</p>
              <Button
                size="lg"
                variant={p.featured ? "default" : "outline"}
                className="mt-auto rounded-full w-full h-12"
                onClick={() => choosePlan(p.id)}
              >
                Choose {p.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 px-6">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-4xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
              Questions, answered.
            </h2>
          </div>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display font-semibold text-lg text-foreground hover:no-underline hover:text-primary py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Apply & pay */}
      <section id="apply" className={`${INK} py-20 lg:py-32 px-6 scroll-mt-20`}>
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-28 text-white">
            <div className="space-y-4">
              <Eyebrow light>Apply</Eyebrow>
              <h2 className="text-4xl sm:text-5xl font-display font-bold leading-[1.05] tracking-tight">
                Your idea has waited long enough.
              </h2>
              <p className="text-white/70 leading-relaxed">
                Applications for {COHORT.name} close {COHORT.dates.registrationCloses}. Onboarding is{" "}
                {COHORT.dates.onboarding} and classes start {COHORT.dates.classesStart}.{" "}
                <DaysLeft className="text-white font-medium" />
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Your seat</p>
              <div className="grid grid-cols-2 gap-3">
                {COHORT.pricing.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    disabled={submitted}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      p.id === planId
                        ? "border-white bg-white/10"
                        : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <p className="text-sm text-white/60">{p.name}</p>
                    <p className="text-2xl font-display font-bold">{p.price}</p>
                  </button>
                ))}
              </div>
            </div>
            <ol className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
              {[
                ["Apply", "Fill in the form."],
                ["Pay", "Confirm your seat."],
                ["You're in", `Onboarding ${COHORT.dates.onboarding}.`],
              ].map(([t, d], i) => (
                <li key={t}>
                  <p className={`font-display font-bold ${LILAC}`}>0{i + 1}</p>
                  <p className="mt-2 font-medium">{t}</p>
                  <p className="text-white/60">{d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl bg-card p-8 sm:p-10">
            {submitted ? (
              <PaymentStep plan={plan} />
            ) : (
              <ConfigForm
                formType="venture_builder"
                initialValues={planValue}
                onSuccess={() => setSubmitted(true)}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
