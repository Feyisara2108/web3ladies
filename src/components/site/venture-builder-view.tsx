"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CalendarDays,
  Check,
  CircleCheckBig,
  CreditCard,
  FlaskConical,
  Hammer,
  Layers,
  Lightbulb,
  Quote,
  Rocket,
  Trophy,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COHORT, type CohortPlan } from "@/lib/venture-cohort";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";
import { Countdown } from "./venture/countdown";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const BUILD_STAGES = [
  { icon: Lightbulb, label: "Idea", detail: "Refine and validate", weeks: "Weeks 1–2" },
  { icon: Layers, label: "Structure", detail: "Users, flows, product logic", weeks: "Weeks 3–4" },
  { icon: Hammer, label: "Build", detail: "Your MVP, live with mentors", weeks: "Weeks 5–7" },
  { icon: Rocket, label: "Ship", detail: "Test, iterate, Demo Day", weeks: "Week 8" },
];

const USUAL_WAY = [
  "Watching tutorials and hoping it sticks",
  "Jumping between dozens of disconnected tools",
  "An idea that never leaves your notes app",
];

const OUR_WAY = [
  "Building live, twice a week, alongside your mentors",
  "One lean tool stack, used from day one to launch",
  "A working MVP tested with real users",
];

const OUTCOMES = [
  {
    icon: Rocket,
    title: "A working MVP",
    desc: "A functional product or prototype with its core features in place — shipped, not just planned.",
  },
  {
    icon: FlaskConical,
    title: "Real user feedback",
    desc: "You test with at least five real users and improve your product from what they tell you.",
  },
  {
    icon: Brain,
    title: "AI & product skills",
    desc: "Prompting, AI-assisted building, user flows and product thinking you'll keep using.",
  },
  {
    icon: Trophy,
    title: "Demo Day",
    desc: "Show what you built, graduate, and stay connected to the Web3Ladies ecosystem.",
  },
];

const PHASES = [
  {
    phase: "Weeks 1–2",
    title: "Foundations",
    desc: "AI and Web3 thinking, prompting for product work, and a sharpened idea.",
  },
  {
    phase: "Weeks 3–4",
    title: "Explore & design",
    desc: "A validated problem, clear users, user flows and an MVP build plan.",
  },
  {
    phase: "Weeks 5–8",
    title: "Build & ship",
    desc: "Build core features live, test with real users, iterate — then Demo Day.",
  },
];

const IDEAS = [
  "A savings app for market traders",
  "An AI study buddy for students",
  "A booking tool for local service businesses",
  "A rewards app for community members",
  "A marketplace for African creators",
  "An AI assistant for small business owners",
];

const FOUNDER_IMAGE = "/assets/founder-oluchi-BnQV3JEa.png";

const INCLUDED = [
  `${COHORT.schedule.weeks * 2} live build sessions with mentors`,
  "Recordings and resources on our learning platform",
  "Mentor feedback and support throughout",
  "Demo Day and graduation",
];

const STATS = [
  { value: "20,000+", label: "women reached" },
  { value: "483+", label: "accepted and trained" },
  { value: "77+", label: "graduates" },
];

const WINS = [
  {
    quote:
      "Consistency and having the right energy makes you excel — we won a prize on the Celo hack!",
    name: "Nofisat Abiodun Ayanlola",
    role: "Hackathon Winner",
  },
  {
    quote: "My team won the $1,500 prize pool at Web3 Lagos Conference under Lisk protocol!",
    name: "Amarachiugwu",
    role: "Hackathon Winner",
  },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You'll build with a lean stack of AI and no-code tools, introduced at the start and used all the way to your MVP.",
  },
  {
    q: "How much time will it take each week?",
    a: `Two live sessions a week (${COHORT.schedule.days}, ${COHORT.schedule.time}) on ${COHORT.schedule.platform}, plus time for your weekly deliverables.`,
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded. Recordings, resources and assignments live on the Web3Ladies learning platform, so you can catch up anytime.",
  },
  {
    q: "Do I have to build something with Web3?",
    a: "No. Web3 is optional and only added where it genuinely improves your product — for example ownership, payments, identity or transparency.",
  },
  {
    q: "When do I pay, and when is my seat confirmed?",
    a: "Right after you apply. Choose your seat option, submit your application and complete payment — your seat is confirmed as soon as your payment is received.",
  },
];

function SectionHeading({ eyebrow, title, desc }: { eyebrow?: string; title: React.ReactNode; desc?: string }) {
  return (
    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 space-y-4">
      {eyebrow && (
        <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">{title}</h2>
      {desc && <p className="text-muted-foreground leading-relaxed">{desc}</p>}
    </motion.div>
  );
}

function PaymentStep({ plan }: { plan: CohortPlan }) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <BadgeCheck className="w-7 h-7 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-foreground">Application received!</h3>
        <p className="text-muted-foreground">
          One last step: complete your payment and your seat in {COHORT.name} is confirmed.
        </p>
      </div>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-center justify-between text-left">
        <div>
          <p className="font-display font-semibold text-foreground">{plan.name}</p>
          <p className="text-xs text-muted-foreground">{plan.note}</p>
        </div>
        <p className="text-3xl font-display font-bold text-primary">{plan.price}</p>
      </div>
      {plan.paymentUrl ? (
        <a
          href={plan.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground h-11 px-8 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CreditCard className="w-4 h-4" /> Pay {plan.price} now
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you a secure payment link shortly. Your seat is confirmed once payment is received.
        </p>
      )}
    </div>
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-[#3b1584] pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 text-white">
        <div className="blob-decoration w-[420px] h-[420px] bg-coral -right-24 top-10 !opacity-30" />
        <div className="blob-decoration w-[360px] h-[360px] bg-white -left-32 bottom-0 !opacity-10" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div className="space-y-8">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center text-sm font-medium bg-white/10 border border-white/20 px-4 py-1.5 rounded-full"
              >
                {COHORT.name} · Starts {COHORT.startMonth} · Applications open
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight"
              >
                Go from idea to a working product in 8 weeks.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl"
              >
                The Web3 × AI Venture Builder is an execution-first program for women ready to stop
                planning and start shipping. Build live with mentors, twice a week, and leave with a
                functional MVP.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-white text-primary hover:bg-white/90 group"
                  onClick={() => scrollTo("apply")}
                >
                  Apply for {COHORT.name}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => scrollTo("pricing")}
                >
                  See pricing
                </Button>
              </motion.div>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80"
              >
                <li className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {COHORT.schedule.weeks} weeks · {COHORT.schedule.days}
                </li>
                <li className="flex items-center gap-2">
                  <Video className="w-4 h-4" /> {COHORT.schedule.time} · Live on {COHORT.schedule.platform}
                </li>
              </motion.ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="rounded-3xl bg-card text-foreground shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Your build
                    </p>
                    <p className="font-display font-semibold text-lg">Idea → working product</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                    8 weeks
                  </span>
                </div>
                <div className="space-y-4">
                  {BUILD_STAGES.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <s.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.weeks}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-coral"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.8 + i * 0.35, duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-primary/5 border border-primary/20 p-4">
                  <BadgeCheck className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="font-display font-semibold text-sm">MVP shipped · Demo Day</p>
                    <p className="text-xs text-muted-foreground">{COHORT.dates.demoDay}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-sm text-white/80">Applications close in</p>
                <Countdown deadline={COHORT.registrationCloses} tone="dark" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contrast + outcomes */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            title={
              <>
                Most programs teach. <span className="text-primary">This one ships.</span>
              </>
            }
            desc="Your mentor builds live while you apply the exact same steps to your own product — every session moves it forward."
          />
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-muted/40 p-8 space-y-5">
              <p className="font-display font-semibold text-muted-foreground">The usual way</p>
              <ul className="space-y-4">
                {USUAL_WAY.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-8 space-y-5 shadow-lg"
            >
              <p className="font-display font-semibold text-primary">The Venture Builder way</p>
              <ul className="space-y-4">
                {OUR_WAY.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OUTCOMES.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <o.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading eyebrow="The 8-week journey" title="Three phases, one working product" />
          <div className="grid md:grid-cols-3 gap-6">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium text-primary">{p.phase}</span>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideas */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp} className="space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              What could <span className="text-primary">you</span> build?
            </h2>
            <p className="text-muted-foreground">A few examples to spark your own idea.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {IDEAS.map((idea, i) => (
              <motion.span
                key={idea}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground"
              >
                <Lightbulb className="w-4 h-4 text-primary" />
                {idea}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 lg:py-24 px-6 bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center">
            <motion.img
              src={FOUNDER_IMAGE}
              alt="Oluchi Enebeli, Founder of Web3Ladies"
              className="rounded-3xl shadow-lg w-full max-w-[220px] mx-auto object-cover aspect-[3/4]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            />
            <motion.div {...fadeUp} className="space-y-5">
              <Quote className="w-10 h-10 text-primary/30" />
              <p className="text-2xl sm:text-3xl font-display font-semibold text-foreground leading-snug">
                If the room did not naturally make space for more women, then I would help build a
                bigger room.
              </p>
              <div>
                <p className="font-display font-semibold text-foreground">Oluchi Enebeli</p>
                <p className="text-sm text-muted-foreground">Founder, Web3Ladies</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 px-6 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Invest in what you'll build"
            desc={`Choose your seat, apply, and pay right away to secure your place in ${COHORT.name}.`}
          />
          <div className="grid md:grid-cols-2 gap-6">
            {COHORT.pricing.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border p-8 flex flex-col ${p.featured ? "border-primary/40 bg-primary/5 shadow-xl" : "border-border bg-card"}`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Best value
                  </span>
                )}
                <p className="font-display font-semibold text-lg text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.note}</p>
                <p className="text-5xl font-display font-bold text-foreground my-6">{p.price}</p>
                <ul className="space-y-3 mb-8">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CircleCheckBig className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant={p.featured ? "default" : "outline"}
                  className={`mt-auto rounded-full w-full ${p.featured ? "" : "border-primary/30"}`}
                  onClick={() => choosePlan(p.id)}
                >
                  Choose {p.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 lg:py-24 px-6 bg-section-rose">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Backed by Web3Ladies"
            title={
              <>
                Women in our community{" "}
                <span className="text-primary whitespace-nowrap">build and win</span>
              </>
            }
          />
          <div className="grid grid-cols-3 gap-4 mb-10">
            {STATS.map((s) => (
              <motion.div key={s.label} {...fadeUp} className="text-center">
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {WINS.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-rose/15 p-7 space-y-4"
              >
                <Quote className="w-8 h-8 text-primary/20" />
                <p className="font-display font-semibold text-foreground leading-snug">&quot;{w.quote}&quot;</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card px-6 sm:px-8">
            <Accordion type="single" collapsible>
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className={i === FAQS.length - 1 ? "border-b-0" : ""}>
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline hover:text-primary">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Apply & pay */}
      <section id="apply" className="py-20 lg:py-28 px-6 bg-section-alt scroll-mt-20">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          <motion.div {...fadeUp} className="space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Apply now
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
                Your product won&apos;t build itself.{" "}
                <span className="text-primary">Let&apos;s build it together.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Applications close {COHORT.dates.registrationCloses}. Onboarding is{" "}
                {COHORT.dates.onboarding} and classes start {COHORT.dates.classesStart}.
              </p>
            </div>
            <Countdown deadline={COHORT.registrationCloses} />
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Your seat</p>
              <div className="grid grid-cols-2 gap-3">
                {COHORT.pricing.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    disabled={submitted}
                    className={`rounded-2xl border p-4 text-left transition-colors ${p.id === planId ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"}`}
                  >
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-2xl font-display font-bold text-primary">{p.price}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">1. Apply</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium text-foreground">2. Pay</span>
              <ArrowRight className="w-4 h-4" />
              <span className="font-medium text-foreground">3. You&apos;re in</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xl"
          >
            {submitted ? (
              <PaymentStep plan={plan} />
            ) : (
              <ConfigForm
                formType="venture_builder"
                initialValues={planValue}
                onSuccess={() => setSubmitted(true)}
              />
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
