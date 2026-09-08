
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { Testimonials } from "@/components/public/testimonials";
import { CTASection } from "@/components/public/cta-section";
import { getCohorts, getTestimonialsByPlacement } from "@/lib/queries";

export const metadata = { title: "Cohorts — Web3Ladies" };

const TRACKS = [
  { t: "Onchain Products, Payments, and Stablecoins", d: "Wallets, payments, digital assets, and consumer finance." },
  { t: "Smart Contracts and Protocol Engineering", d: "Solidity, protocol systems, and blockchain infrastructure." },
  { t: "Ecosystem Growth, Community, and DevRel", d: "Non-coding roles in partnerships, community, and developer relations." },
];

const STEPS = [
  "Structured, guided learning",
  "Mentorship and feedback",
  "Practical exercises",
  "Peer support",
  "Clear action outcomes",
];

export default async function CohortsPage() {
  const [cohorts, testimonials] = await Promise.all([
    getCohorts(),
    getTestimonialsByPlacement("cohorts"),
  ]);

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <Badge variant="muted" className="mx-auto">Coming Back Soon</Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Cohorts built for where Web3 is headed
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Not everyone needs the same roadmap. Our cohorts are designed around
            real pathways, real market shifts, and real career possibilities
            within Web3.
          </p>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <SectionHeading eyebrow="Tracks" title="Find the pathway that fits your next chapter" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TRACKS.map((t) => (
              <Card key={t.t} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">{t.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <SectionHeading eyebrow="How it works" title="Structured support from start to finish" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {STEPS.map((s) => (
              <Badge key={s} variant="secondary" className="text-sm">{s}</Badge>
            ))}
          </div>
        </Container>
      </Section>

      {cohorts.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="Open cohorts" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cohorts.map((c) => (
                <Card key={c.id} className="h-full">
                  <CardContent className="flex h-full flex-col gap-2 p-6">
                    {c.track && <Badge>{c.track}</Badge>}
                    <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                    {c.description && <p className="flex-1 text-sm text-muted-foreground">{c.description}</p>}
                    {c.apply_url && (
                      <Link href={c.apply_url} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Join a Cohort
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {testimonials.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="What our cohort graduates say" />
            <div className="mt-10">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      <CTASection
        title="Ready to join a cohort?"
        description="Join the community to hear when applications open."
        primary={{ label: "Join Community", href: "/community" }}
        secondary={{ label: "Apply to Venture Builder", href: "/venture-builder" }}
      />
    </>
  );
}
