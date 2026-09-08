import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { Testimonials } from "@/components/public/testimonials";
import { DynamicForm } from "@/components/public/dynamic-form";
import { CTASection } from "@/components/public/cta-section";
import { getFormConfig, getTestimonialsByPlacement } from "@/lib/queries";

export const metadata = { title: "Community — Web3Ladies" };

// Verbatim from the live site — see docs/live-content-reference.md
const INSIDE = [
  "Real conversations",
  "Encouragement without gatekeeping",
  "Opportunities and ecosystem updates",
  "Peer accountability",
  "Mentorship moments",
  "A network of women building in public and growing on purpose",
];

const VALUES = [
  "Access", "Practical growth", "Bold learning",
  "Collaboration", "Visibility", "Real-world outcomes",
];

export default async function CommunityPage() {
  const [config, testimonials] = await Promise.all([
    getFormConfig("community_join"),
    getTestimonialsByPlacement("community"),
  ]);

  return (
    <>
      {/* Hero */}
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A community for women building with courage, clarity, and support
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Web3Ladies is a home for women learning, building, transitioning, and
            leading across Web3, AI, and adjacent emerging technologies.
          </p>
          <div className="mt-8">
            <Link href="#join" className={buttonVariants({ size: "lg" })}>
              Join Community
            </Link>
          </div>
        </Container>
      </Section>

      {/* Why community matters */}
      <Section className="py-14">
        <Container className="max-w-3xl text-center">
          <SectionHeading title="Why community matters" />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Too many women try to navigate emerging technology in isolation —
            learning quietly, doubting themselves, second-guessing their next
            step, and feeling like everyone else knows more. Web3Ladies exists to
            change that. This is a space for support, accountability, access, and
            becoming.
          </p>
        </Container>
      </Section>

      {/* Inside the community */}
      <Section className="bg-warm py-14">
        <Container>
          <SectionHeading title="Inside the community" />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {INSIDE.map((f) => (
              <li key={f} className="rounded-lg border border-border bg-card p-4 text-sm">
                {f}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Our values */}
      <Section className="py-14">
        <Container>
          <SectionHeading title="Our values" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {VALUES.map((v) => (
              <Badge key={v} variant="secondary" className="text-sm">{v}</Badge>
            ))}
          </div>
        </Container>
      </Section>

      {/* Join form */}
      <Section id="join" className="bg-warm py-16">
        <Container className="max-w-2xl">
          <SectionHeading
            title="Join the community"
            description="Tell us a little about you. It's free to join."
          />
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <DynamicForm config={config} formKey="community_join" fallbackTitle="Community Join" />
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="What our community members say" />
            <div className="mt-10">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      {/* Closing CTA */}
      <CTASection
        title="You do not have to figure it all out alone"
        description="Join a community built to help women keep learning, keep building, and keep becoming."
        primary={{ label: "Join Community", href: "#join" }}
      />
    </>
  );
}
