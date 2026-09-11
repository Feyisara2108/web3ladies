import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";
import { ImpactStats } from "@/components/public/impact-stats";
import { PartnersMarquee } from "@/components/public/partners-marquee";
import { Testimonials } from "@/components/public/testimonials";
import { DynamicForm } from "@/components/public/dynamic-form";
import {
  getFormConfig,
  getImpactStats,
  getPartners,
  getTestimonialsByPlacement,
} from "@/lib/queries";

export const metadata = { title: "Partner — Web3Ladies" };

// Package names/prices and "ways to work with us" are verbatim from the live
// site. Body copy for the narrative sub-sections is approximate — see
// docs/live-content-reference.md (marked UNKNOWN where not fully observable).
const PACKAGES = [
  { tier: "Scholarship Partner", price: "$2,500", note: "Funds scholarship seats" },
  { tier: "Work Tool Partner", price: "$3,000", note: "Laptops, internet, software" },
  { tier: "Event Series Sponsor", price: "$5,000–$10,000", note: "Themed workshops and meetups" },
  { tier: "Cohort / Track Sponsor", price: "$7,500", note: "Focused learning track support" },
  { tier: "Annual Ecosystem Partner", price: "$15,000–$30,000", note: "Ongoing support and visibility" },
  { tier: "Custom Partnership", price: "Let's Talk", note: "Tailored arrangements" },
];

const WAYS = [
  "Program sponsorship", "Event sponsorship", "Tool sponsorship", "Mentorship collaboration",
  "Ecosystem partnerships", "Speaker partnerships", "Community activations", "Talent and visibility initiatives",
];

export default async function PartnerPage() {
  const [config, impact, partners, testimonials] = await Promise.all([
    getFormConfig("partner_inquiry"),
    getImpactStats(),
    getPartners(),
    getTestimonialsByPlacement("partner"),
  ]);

  return (
    <>
      {/* Hero */}
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Partner with Web3Ladies
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Support the next generation of women building across Web3, AI, and
              emerging technology.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Why partner with us */}
      <Section className="py-14">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionHeading title="Why partner with us" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Partner with Web3Ladies to fund specific outcomes: scholarship seats,
              work tool support, event access, and visible pathways for women
              building in Web3 and emerging technology.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Sponsor outcomes, not just activity */}
      <Section className="bg-warm py-14">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionHeading title="Sponsor outcomes, not just activity" />
            <p className="mt-6 text-muted-foreground">
              Every partnership maps to a concrete result — women trained, tools
              delivered, events run, and opportunities opened.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Proof of impact */}
      {impact.length > 0 && (
        <Section className="py-14">
          <Container>
            <Reveal><SectionHeading title="Proof of impact" /></Reveal>
            <Reveal delay={120} className="mt-10">
              <ImpactStats stats={impact} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* What partnerships look like in practice */}
      <Section className="bg-warm py-14">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionHeading title="What partnerships look like in practice" />
            <p className="mt-6 text-muted-foreground">
              From scholarship and work tool support to themed event series,
              cohort tracks, and annual ecosystem partnerships — we shape the
              engagement around the outcomes you care about.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* What our community says */}
      {testimonials.length > 0 && (
        <Section className="bg-rose-light py-14">
          <Container>
            <Reveal><SectionHeading title="What our community says" /></Reveal>
            <Reveal delay={120} className="mt-10">
              <Testimonials items={testimonials} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* Organizations we've worked with */}
      {partners.length > 0 && (
        <Section className="bg-warm py-14">
          <Container>
            <Reveal><SectionHeading title="Organizations we've worked with" /></Reveal>
            <Reveal delay={120} className="mt-10">
              <PartnersMarquee partners={partners} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* Sponsorship packages */}
      <Section className="py-14">
        <Container>
          <Reveal><SectionHeading title="Sponsorship packages" /></Reveal>
          <Reveal delay={120} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <Card key={p.tier} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">{p.tier}</h3>
                  <div className="mt-1 font-display text-xl font-bold text-primary">{p.price}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                </CardContent>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* Ways to work with us */}
      <Section className="bg-warm py-14">
        <Container>
          <Reveal><SectionHeading title="Ways to work with us" /></Reveal>
          <Reveal delay={120} className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {WAYS.map((w) => (
              <span key={w} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{w}</span>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* What your partnership helps make possible */}
      <Section className="py-14">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionHeading title="What your partnership helps make possible" />
            <p className="mt-6 text-muted-foreground">
              More women trained and mentored, more work tools in the hands of
              builders who need them, more events and cohorts, and more women
              securing real opportunities in emerging technology.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Partner form */}
      <Section className="bg-warm py-16">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              title="Let's build something meaningful together"
              description="Tell us how you'd like to partner and we'll be in touch."
            />
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <DynamicForm config={config} formKey="partner_inquiry" fallbackTitle="Partner Inquiry" />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
