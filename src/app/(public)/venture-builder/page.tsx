import Link from "next/link";
import { Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";
import { DynamicForm } from "@/components/public/dynamic-form";
import { CTASection } from "@/components/public/cta-section";
import { getFormConfig } from "@/lib/queries";

export const metadata = { title: "Web3 x AI Venture Builder — Web3Ladies" };

const AUDIENCE = [
  "Aspiring founders and venture-minded builders",
  "Women exploring AI and Web3 product ideas",
  "Technical professionals expanding into new areas",
  "Career pivoters ready to build",
  "Community members seeking structure and accountability",
];

const MODULES = [
  { n: "01", t: "Foundations", d: "Web3, AI, and the onchain products landscape." },
  { n: "02", t: "Problem Selection", d: "Identifying real-world problems worth solving." },
  { n: "03", t: "AI x Web3 Opportunity Design", d: "Use cases across multiple sectors." },
  { n: "04", t: "Build and Validate", d: "MVP design and rapid validation." },
  { n: "05", t: "Go-to-Market Thinking", d: "Positioning, traction, and storytelling." },
  { n: "06", t: "Demo and Visibility", d: "Showcasing your outcomes." },
];

const BENEFITS = [
  "Practical live sessions",
  "Builder worksheets and resources",
  "Mentorship and feedback",
  "Accountability and peer support",
  "Exposure to use cases and trends",
  "Demo and visibility opportunity",
];

const PRICING = [
  { tier: "Standard", price: "$549+", note: "Standard starting price" },
  { tier: "Early Bird", price: "$349", note: "Limited-time offer" },
  { tier: "Discounted Standard", price: "$149", note: "Need / sponsorship-based" },
  { tier: "Discounted Early Bird", price: "$99", note: "Need / sponsorship-based" },
  { tier: "Scholarship Seats", price: "Varies", note: "Fully or partially sponsored" },
];

export default async function VentureBuilderPage() {
  const config = await getFormConfig("venture_builder");

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <Badge variant="muted" className="mx-auto">
              Flagship Program · 6 Weeks · Limited Seats
            </Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Web3 × AI Venture Builder
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A high-conviction, application-based program for women building
              future-ready careers, products, and opportunities across Web3, AI,
              and the future of work.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="#apply" className={buttonVariants({ size: "lg" })}>
                Apply Now
              </Link>
              <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Sponsor a Seat
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="py-14">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              align="left"
              title="What this program is about"
              description="A practical bootcamp — not a theory-heavy course — for women who want clarity in emerging technology and want to build something meaningful."
              className="max-w-none"
            />
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <Reveal><SectionHeading eyebrow="Who it's for" title="Built for women ready to build" /></Reveal>
          <Reveal delay={120}>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {AUDIENCE.map((a) => (
                <li key={a} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <Reveal><SectionHeading eyebrow="Program modules" title="Six weeks, six milestones" /></Reveal>
          <Reveal delay={120} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <Card key={m.n} className="h-full">
                <CardContent className="p-6">
                  <div className="font-display text-2xl font-bold text-primary/40">{m.n}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold">{m.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.d}</p>
                </CardContent>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <Reveal><SectionHeading eyebrow="What participants get" title="Everything you need to build" /></Reveal>
          <Reveal delay={120}>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <Reveal><SectionHeading title="Investment" description="Flexible options, including need- and sponsorship-based seats." /></Reveal>
          <Reveal delay={120}>
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-border">
              {PRICING.map((p, i) => (
                <div
                  key={p.tier}
                  className={`flex items-center justify-between gap-4 p-4 ${i % 2 ? "bg-muted/40" : "bg-card"}`}
                >
                  <div>
                    <div className="font-medium">{p.tier}</div>
                    <div className="text-sm text-muted-foreground">{p.note}</div>
                  </div>
                  <div className="font-display text-lg font-bold text-primary">{p.price}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* What success looks like */}
      <Section className="bg-warm py-14">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionHeading title="What success looks like" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              By the end, you should walk away with stronger clarity, sharper
              thinking, a validated idea or working concept, deeper confidence, and
              a more visible next step.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section id="apply" className="py-16">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              title="Apply to the Web3 x AI Venture Builder"
              description="This program is for women ready to build with more clarity, confidence, and intention."
            />
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <DynamicForm config={config} formKey="venture_builder" fallbackTitle="Venture Builder Application" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection
        title="Ready to build what's next?"
        description="Join the next Web3 x AI Venture Builder and start turning curiosity into capability."
        primary={{ label: "Apply Now", href: "#apply" }}
        secondary={{ label: "Sponsor a Seat", href: "/partner" }}
      />
    </>
  );
}
