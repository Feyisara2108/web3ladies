import { Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";
import { DynamicForm } from "@/components/public/dynamic-form";
import { getFormConfig } from "@/lib/queries";

export const metadata = { title: "Web3Ladies Circle — Membership" };

const BENEFITS = [
  "Monthly private sessions with builders and industry leaders",
  "Office hours / AMA for feedback and problem-solving",
  "Curated opportunity board (jobs, grants, partnerships)",
  "Accountability pod access",
  "Member directory across Africa and the UAE",
  "Members-only networking channels",
  "Select partner perks and discounts",
];

const PRICING = [
  { tier: "Founding", price: "$199/year", note: "Early-bird rate" },
  { tier: "Standard", price: "$20/mo or $249/year", note: "Ongoing rate" },
  { tier: "Scholarship Founding", price: "$79/year", note: "Need-based" },
  { tier: "Scholarship Standard", price: "$10/mo or $99/year", note: "Need-based" },
];

export default async function MembershipPage() {
  const config = await getFormConfig("membership_application");

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <Badge variant="muted" className="mx-auto">Coming Soon — Founding Members First</Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Web3Ladies Circle</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A curated membership for women serious about building with more
              clarity, stronger support, and better access.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="py-14">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              align="left"
              title="More than a membership"
              description="This is not a passive community membership. It is a sharper room for women who want consistency, curated access, accountability, and proximity to opportunities, mentors, and peers."
              className="max-w-none"
            />
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <Reveal><SectionHeading title="What Circle members get" /></Reveal>
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
          <Reveal><SectionHeading title="Membership pricing" /></Reveal>
          <Reveal delay={120}>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {PRICING.map((p) => (
                <div key={p.tier} className="rounded-xl border border-border bg-card p-6">
                  <div className="font-medium">{p.tier}</div>
                  <div className="mt-1 font-display text-xl font-bold text-primary">{p.price}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{p.note}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-warm py-16">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              title="Not for everyone. Built for women ready to do the work."
              description="If you want structured support, real accountability, curated access, and a network that keeps you moving — this is your room."
            />
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <DynamicForm config={config} formKey="membership_application" fallbackTitle="Membership Application" />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
