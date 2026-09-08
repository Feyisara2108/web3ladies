import Link from "next/link";
import {
  Rocket,
  Wrench,
  CalendarDays,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { FeaturedCards } from "@/components/public/featured-cards";
import { ImpactStats } from "@/components/public/impact-stats";
import { PartnersMarquee } from "@/components/public/partners-marquee";
import { Testimonials } from "@/components/public/testimonials";
import { CTASection } from "@/components/public/cta-section";
import {
  getFeaturedItems,
  getImpactStats,
  getPartners,
  getFounderStory,
  getTestimonialsByPlacement,
} from "@/lib/queries";

// Structural page copy below (hero, offerings, paths, audiences, differentiators)
// is site chrome, not CMS-managed. CMS content (featured, impact, partners,
// testimonials, founder story) is loaded from the database.

// Verbatim copy from the live site — see docs/live-content-reference.md
const OFFERINGS = [
  {
    icon: Rocket,
    title: "Web3 x AI Venture Builder",
    body: "A hands-on experience for women building future-facing careers, products, and ventures at the intersection of blockchain, AI, and the future of work.",
    href: "/venture-builder",
  },
  {
    icon: Wrench,
    title: "Worktool Grants",
    body: "Sponsor-backed work tool support for selected women builders — laptops, internet, software access, and essential resources to keep building.",
    href: "/partner",
  },
  {
    icon: CalendarDays,
    title: "Events",
    body: "Workshops, AMAs, masterclasses, meetups, and conversations that connect women to real ideas, real builders, and real opportunities.",
    href: "/events",
  },
  {
    icon: Users,
    title: "Community",
    body: "A support system for ambitious women navigating learning, transition, visibility, accountability, and growth in emerging technology.",
    href: "/community",
  },
];

const PATHS = [
  { title: "Join the Community", body: "Free access to our global network of women learning and building in emerging technology.", cta: "Join Free", href: "/community" },
  { title: "Apply to Venture Builder", body: "Our flagship paid program — build your MVP, grow your skills, and demo what you create.", cta: "Apply Now", href: "/venture-builder" },
  { title: "Sponsor a Seat", body: "Fund a scholarship seat and help widen access for women building in emerging tech.", cta: "Partner With Us", href: "/partner" },
  { title: "Host With Us", body: "Partner with us to host a workshop, AMA, meetup, or community conversation for women in tech.", cta: "Host With Us", href: "/events" },
];

const AUDIENCES = [
  "Women exploring careers in blockchain, AI, and emerging technology",
  "Early-career builders looking for structure, community, and direction",
  "Technical professionals growing into deeper specialization",
  "Founders and aspiring founders building future-facing products",
  "Women who already have a career in finance, law, healthcare, education, or anywhere else, and are ready to bring blockchain or AI into what they already know how to do",
];

const DIFFERENTIATORS = [
  "We are future-focused — always preparing women for the future of work, opportunity, and impact",
  "We care about practical outcomes, not just motivational language",
  "We combine skills, mentorship, exposure, and community support",
  "We are building a space where women can learn, build, lead, and be seen",
];

export default async function HomePage() {
  const [featured, impact, partners, founder, testimonials] = await Promise.all([
    getFeaturedItems(),
    getImpactStats(),
    getPartners(),
    getFounderStory(),
    getTestimonialsByPlacement("home"),
  ]);

  const whyWeExist = founder.find((f) => f.section_key === "why") ?? founder[0];

  return (
    <>
      {/* Hero */}
      <Section className="pb-12 pt-16 sm:pt-24">
        <Container className="text-center">
          <Badge variant="muted" className="mx-auto">
            Blockchain · AI · The future of work
          </Badge>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build your career, product, or next chapter in emerging technologies
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {`Web3Ladies is more than a community. It's a launchpad for women building what's next across Web3, AI, and emerging technology.`}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/community" className={buttonVariants({ size: "lg" })}>
              Join Community
            </Link>
            <Link
              href="/venture-builder"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Apply Now
            </Link>
          </div>
        </Container>
      </Section>

      {/* What's happening (Featured) */}
      {featured.length > 0 && (
        <Section className="py-12">
          <Container>
            <SectionHeading eyebrow="What's happening" title="Fresh from Web3Ladies" />
            <div className="mt-10">
              <FeaturedCards items={featured} />
            </div>
          </Container>
        </Section>
      )}

      {/* Impact */}
      {impact.length > 0 && (
        <Section className="bg-warm py-16">
          <Container>
            <SectionHeading
              title="Built with impact. Growing with intention"
              description="A snapshot of what the Web3Ladies community has achieved together."
            />
            <div className="mt-12">
              <ImpactStats stats={impact} />
            </div>
          </Container>
        </Section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <Section className="py-16">
          <Container>
            <p className="mb-10 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              With these partners
            </p>
            <PartnersMarquee partners={partners} />
          </Container>
        </Section>
      )}

      {/* What we offer */}
      <Section className="py-16">
        <Container>
          <SectionHeading eyebrow="What we offer" title="More than a community. A launchpad." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERINGS.map((o) => (
              <Card key={o.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <o.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{o.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{o.body}</p>
                  <Link
                    href={o.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Learn more <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Choose your path */}
      <Section className="bg-warm py-16">
        <Container>
          <SectionHeading eyebrow="Choose your path" title="However you want to build, there's a way in" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((p) => (
              <Card key={p.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{p.body}</p>
                  <Link href={p.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    {p.cta}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who this is for */}
      <Section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Who this is for"
            title="For women ready to build what's next"
            className="max-w-none"
          />
          <ul className="space-y-4">
            {AUDIENCES.map((a) => (
              <li key={a} className="flex items-start gap-3">
                <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ArrowRight className="size-3" />
                </span>
                <span className="text-muted-foreground">{a}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* What makes us different */}
      <Section className="bg-warm py-16">
        <Container>
          <SectionHeading eyebrow="What makes us different" title="Why Web3Ladies works" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((d) => (
              <Card key={d} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  <p className="text-sm text-foreground">{d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Web3Ladies exists (Founder story) */}
      {whyWeExist && (
        <Section className="py-16">
          <Container className="max-w-3xl text-center">
            <SectionHeading title={whyWeExist.heading ?? "Why Web3Ladies exists"} />
            {whyWeExist.body && (
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {whyWeExist.body}
              </p>
            )}
          </Container>
        </Section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="bg-warm py-16">
          <Container>
            <SectionHeading title="Women in our community are winning" />
            <div className="mt-12">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      <CTASection
        title="Ready to build with intention?"
        description="Join the community or apply to the Venture Builder and turn curiosity into capability."
        primary={{ label: "Join Community", href: "/community" }}
        secondary={{ label: "Apply Now", href: "/venture-builder" }}
      />
    </>
  );
}
