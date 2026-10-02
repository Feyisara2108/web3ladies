"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CreditCard } from "lucide-react";
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

const IMG_BUILDER = "/assets/w3l-builder-COStughb.jpg";
const IMG_FOUNDER = "/assets/founder-oluchi-BnQV3JEa.png";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const OUTCOMES = [
  {
    title: "A working MVP",
    desc: "A functional product or prototype with its core features in place.",
  },
  {
    title: "Feedback from real users",
    desc: "You test with at least five people and improve the product based on what they say.",
  },
  {
    title: "Skills you keep",
    desc: "Prompting, AI-assisted building, user flows and product thinking.",
  },
  {
    title: "A place at Demo Day",
    desc: "You present what you built, graduate, and stay part of the Web3Ladies community.",
  },
];

const PHASES = [
  {
    weeks: "Weeks 1–2",
    title: "Foundations",
    desc: "How AI and Web3 are changing product building, prompting for product work, and choosing the idea you'll build.",
  },
  {
    weeks: "Weeks 3–4",
    title: "Explore and design",
    desc: "Validate the problem, define your users, map the user flows and write a clear MVP plan.",
  },
  {
    weeks: "Weeks 5–8",
    title: "Build and ship",
    desc: "Set up your tools, build the core features, test with real users, improve, and present at Demo Day.",
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

const KEY_DATES = [
  { label: "Applications close", date: COHORT.dates.registrationCloses },
  { label: "Onboarding", date: COHORT.dates.onboarding },
  { label: "Classes start", date: COHORT.dates.classesStart },
  { label: "Demo Day", date: COHORT.dates.demoDay },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You'll build with a small set of AI and no-code tools, introduced in the first week and used all the way to your MVP.",
  },
  {
    q: "How much time will it take each week?",
    a: `Two live sessions a week (${COHORT.schedule.days}, ${COHORT.schedule.time}) on ${COHORT.schedule.platform}, plus time for your weekly deliverables.`,
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded. Recordings, resources and assignments are on the Web3Ladies learning platform, so you can catch up anytime.",
  },
  {
    q: "Do I have to build something with Web3?",
    a: "No. Web3 is optional. We add it only where it improves your product, for example for ownership, payments, identity or transparency.",
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
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-6">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <p className="text-sm font-medium text-primary">
              Web3 × AI Venture Builder · {COHORT.name}, {COHORT.startMonth}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight text-foreground">
              Go from idea to a working product in 8 weeks.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              A live, hands-on program for women who are ready to stop planning and start building.
              Twice a week you build alongside our mentors, and by the end you have a product real
              people have used.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button size="lg" className="rounded-full px-8" onClick={() => scrollTo("apply")}>
                Apply for {COHORT.name}
              </Button>
              <button
                type="button"
                onClick={() => scrollTo("pricing")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                See pricing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4 gap-y-1">
              <p className="font-display font-semibold text-lg text-foreground">
                {COHORT.name} at a glance
              </p>
              <DaysLeft className="text-sm text-muted-foreground" />
            </div>
            <ol className="mt-6 border-l border-border ml-1.5 space-y-6">
              {KEY_DATES.map((d) => (
                <li key={d.label} className="relative pl-6">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-card" />
                  <p className="text-sm text-muted-foreground">{d.label}</p>
                  <p className="font-medium text-foreground">{d.date}</p>
                </li>
              ))}
            </ol>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Live sessions</dt>
                <dd className="font-medium text-foreground mt-1">
                  Tue &amp; Fri, 5–7 PM WAT on {COHORT.schedule.platform}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Seats from</dt>
                <dd className="font-display text-2xl font-bold text-foreground mt-0.5">
                  {COHORT.pricing[0].price}
                </dd>
              </div>
            </dl>
          </motion.aside>
        </div>
      </section>

      {/* What it is */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          <img
            src={IMG_BUILDER}
            alt="A participant building on her laptop"
            className="w-full rounded-2xl object-cover aspect-[4/3] order-last lg:order-first"
          />
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
              You build during the session, not after it.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In every session a mentor works through a real example project live. You follow the
              same steps on your own idea at the same time, then keep going with support until
              you&apos;re unblocked.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We use one small set of AI and no-code tools from the first week to the last, so you
              spend your time building instead of learning new software every week.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 lg:py-24 px-6 bg-section-alt">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight max-w-xl mb-12">
            What you&apos;ll have at the end of the 8 weeks
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {OUTCOMES.map((o, i) => (
              <div key={o.title} className="border-t-2 border-foreground pt-5 space-y-2">
                <p className="text-sm text-muted-foreground tabular-nums">0{i + 1}</p>
                <h3 className="font-display font-semibold text-lg text-foreground">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 lg:py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-4">
            How the 8 weeks run
          </h2>
          <p className="text-muted-foreground mb-10">
            Live on {COHORT.schedule.platform}, {COHORT.schedule.days}, {COHORT.schedule.time}. New
            resources go up every Monday, and there are optional office hours on some Saturdays.
          </p>
          <div className="divide-y divide-border border-y border-border">
            {PHASES.map((p) => (
              <div key={p.title} className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 py-7">
                <p className="text-sm font-medium text-primary pt-1">{p.weeks}</p>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-xl text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <p className="text-sm font-medium text-foreground mb-4">
              Not sure what to build yet? Here are a few example ideas:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-muted-foreground">
              {IDEAS.map((idea) => (
                <li key={idea} className="flex gap-3">
                  <span className="text-primary">–</span>
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 lg:py-24 px-6 bg-section-alt">
        <div className="container mx-auto max-w-4xl grid sm:grid-cols-[160px_1fr] gap-8 items-center">
          <img
            src={IMG_FOUNDER}
            alt="Oluchi Enebeli, Founder of Web3Ladies"
            className="w-32 sm:w-40 rounded-2xl object-cover aspect-[3/4]"
          />
          <figure className="space-y-4">
            <blockquote className="text-2xl sm:text-3xl font-display font-semibold text-foreground leading-snug">
              “If the room did not naturally make space for more women, then I would help build a
              bigger room.”
            </blockquote>
            <figcaption className="text-sm text-muted-foreground">
              Oluchi Enebeli, Founder, Web3Ladies
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 px-6 border-t border-border scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-4">
            Pricing
          </h2>
          <p className="text-muted-foreground mb-10">
            Pick your seat, apply, and pay straight away to confirm your place.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {COHORT.pricing.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border p-8 flex flex-col ${p.featured ? "border-foreground" : "border-border"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-display font-semibold text-lg text-foreground whitespace-nowrap">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.note}</p>
                </div>
                <p className="text-5xl font-display font-bold text-foreground my-6">{p.price}</p>
                <Button
                  size="lg"
                  variant={p.featured ? "default" : "outline"}
                  className="mt-auto rounded-full w-full"
                  onClick={() => choosePlan(p.id)}
                >
                  Choose {p.name}
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Both options include {COHORT.schedule.weeks * 2} live build sessions with mentors,
            recordings and resources on our learning platform, feedback and support throughout the
            program, and Demo Day.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-8">
            Questions
          </h2>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Apply & pay */}
      <section id="apply" className="py-16 lg:py-24 px-6 scroll-mt-20">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
                Apply for {COHORT.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Applications close {COHORT.dates.registrationCloses}. Onboarding is{" "}
                {COHORT.dates.onboarding} and classes start {COHORT.dates.classesStart}.{" "}
                <DaysLeft className="text-foreground font-medium" />
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Your seat</p>
              <div className="grid grid-cols-2 gap-3">
                {COHORT.pricing.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    disabled={submitted}
                    className={`rounded-xl border p-4 text-left transition-colors ${p.id === planId ? "border-foreground bg-card" : "border-border hover:border-foreground/40"}`}
                  >
                    <p className="text-sm text-muted-foreground">{p.name}</p>
                    <p className="text-2xl font-display font-bold text-foreground">{p.price}</p>
                  </button>
                ))}
              </div>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1. Apply</span> using the form.
              </li>
              <li>
                <span className="font-medium text-foreground">2. Pay</span> for your seat.
              </li>
              <li>
                <span className="font-medium text-foreground">3. You&apos;re in.</span> We&apos;ll
                see you at onboarding on {COHORT.dates.onboarding}.
              </li>
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
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
