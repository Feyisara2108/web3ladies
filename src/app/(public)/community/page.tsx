import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/public/section-heading";
import { Testimonials } from "@/components/public/testimonials";
import { DynamicForm } from "@/components/public/dynamic-form";
import { getFormConfig, getTestimonialsByPlacement } from "@/lib/queries";

export const metadata = { title: "Community — Web3Ladies" };

const FEATURES = [
  "Real conversations",
  "Encouragement without gatekeeping",
  "Opportunities and ecosystem updates",
  "Peer accountability",
  "Mentorship moments",
  "A network of women building publicly",
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
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A community for women building with courage, clarity, and support
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Web3Ladies is a community for women learning, building,
            transitioning, and leading in Web3, AI, and emerging technologies.
          </p>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <SectionHeading
            eyebrow="Why community matters"
            title="A space for support, accountability, access, and becoming"
            description="Building in tech can be isolating. Here, you're not doing it alone."
          />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="rounded-lg border border-border bg-card p-4 text-sm">
                {f}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <SectionHeading eyebrow="Our values" title="What we stand for" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {VALUES.map((v) => (
              <Badge key={v} variant="secondary" className="text-sm">{v}</Badge>
            ))}
          </div>
        </Container>
      </Section>

      {testimonials.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="From our community" />
            <div className="mt-10">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-warm py-16">
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
    </>
  );
}
