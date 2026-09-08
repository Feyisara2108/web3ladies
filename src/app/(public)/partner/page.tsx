import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
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

const PACKAGES = [
  { tier: "Scholarship Partner", price: "$2,500", note: "Funds scholarship seats" },
  { tier: "Work Tool Partner", price: "$3,000", note: "Laptops, internet, software" },
  { tier: "Event Series Sponsor", price: "$5,000–$10,000", note: "Themed workshops and meetups" },
  { tier: "Cohort / Track Sponsor", price: "$7,500", note: "Focused learning track support" },
  { tier: "Annual Ecosystem Partner", price: "$15,000–$30,000", note: "Ongoing support and visibility" },
  { tier: "Custom Partnership", price: "Contact", note: "Tailored arrangements" },
];

const WAYS = [
  "Program sponsorship", "Event sponsorship", "Tool sponsorship", "Mentorship collaboration",
  "Ecosystem partnerships", "Speaker partnerships", "Community activations", "Talent initiatives",
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
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Partner with Web3Ladies
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Support the next generation of women building across Web3, AI, and
            emerging technology. Fund specific outcomes: scholarship seats, work
            tool support, event access, and visible pathways.
          </p>
        </Container>
      </Section>

      {impact.length > 0 && (
        <Section className="bg-warm py-14">
          <Container>
            <SectionHeading title="Proof of impact" />
            <div className="mt-10">
              <ImpactStats stats={impact} />
            </div>
          </Container>
        </Section>
      )}

      {partners.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="Organizations we've worked with" />
            <div className="mt-10">
              <PartnersMarquee partners={partners} />
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-warm py-14">
        <Container>
          <SectionHeading title="Sponsorship packages" description="Sponsor outcomes, not just activity." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <Card key={p.tier} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">{p.tier}</h3>
                  <div className="mt-1 font-display text-xl font-bold text-primary">{p.price}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <SectionHeading title="Ways to work with us" />
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {WAYS.map((w) => (
              <span key={w} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{w}</span>
            ))}
          </div>
        </Container>
      </Section>

      {testimonials.length > 0 && (
        <Section className="bg-warm py-14">
          <Container>
            <SectionHeading title="What our community says" />
            <div className="mt-10">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      <Section className="py-16">
        <Container className="max-w-2xl">
          <SectionHeading
            title="Let's build something meaningful together"
            description="Tell us how you'd like to partner and we'll be in touch."
          />
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <DynamicForm config={config} formKey="partner_inquiry" fallbackTitle="Partner Inquiry" />
          </div>
        </Container>
      </Section>
    </>
  );
}
