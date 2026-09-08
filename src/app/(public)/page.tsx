import Link from "next/link";
import {
  Rocket,
  Wrench,
  CalendarDays,
  Users,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Gem,
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
import { SocialProof } from "@/components/public/social-proof";
import { NewsletterSubscribe } from "@/components/public/newsletter-subscribe";
import { CTASection } from "@/components/public/cta-section";
import {
  getFeaturedItems,
  getImpactStats,
  getPartners,
  getFounderStory,
  getSocialProof,
  getTestimonialsByPlacement,
} from "@/lib/queries";

// Structural page copy is verbatim from the live site where observable — see
// docs/live-content-reference.md. CMS content (featured, impact, partners,
// social proof, testimonials, founder story) loads from the database.

const OFFERINGS = [
  { icon: Rocket, title: "Web3 x AI Venture Builder", body: "A hands-on experience for women building future-facing careers, products, and ventures at the intersection of blockchain, AI, and the future of work.", href: "/venture-builder" },
  { icon: Wrench, title: "Worktool Grants", body: "Sponsor-backed work tool support for selected women builders — laptops, internet, software access, and essential resources to keep building.", href: "/partner" },
  { icon: CalendarDays, title: "Events", body: "Workshops, AMAs, masterclasses, meetups, and conversations that connect women to real ideas, real builders, and real opportunities.", href: "/events" },
  { icon: Users, title: "Community", body: "A support system for ambitious women navigating learning, transition, visibility, accountability, and growth in emerging technology.", href: "/community" },
];

const COMING_SOON = [
  { icon: GraduationCap, title: "Cohorts", body: "Our focused learning tracks are coming back and we want you in the room when they do. Drop your email and you'll be the first we call.", label: "Coming Back Soon", cta: "Save My Spot", href: "/cohorts" },
  { icon: Gem, title: "Web3Ladies Circle", body: "We're building something more intimate for women who are serious about going deeper. If that's you, we want you to know about it before anyone else does.", label: "Coming Soon", cta: "Put Me on the List", href: "/membership" },
];

const PATHS = [
  { title: "Join the Community", body: "Free access to our global network of women learning and building in emerging technology.", cta: "Join Free", href: "/community" },
  { title: "Apply to Venture Builder", body: "Our flagship paid program — build your MVP, grow your skills, and demo what you create.", cta: "Apply Now", href: "/venture-builder" },
  { title: "Sponsor a Seat", body: "Fund a scholarship seat and help widen access for women building in emerging tech.", cta: "Partner With Us", href: "/partner" },
  { title: "Host an Event", body: "Partner with us to host a workshop, AMA, meetup, or community conversation for women in tech.", cta: "Host With Us", href: "/events" },
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
  const [featured, impact, partners, founder, social, testimonials] =
    await Promise.all([
      getFeaturedItems(),
      getImpactStats(),
      getPartners(),
      getFounderStory(),
      getSocialProof(),
      getTestimonialsByPlacement("home"),
    ]);

  const whyWeExist = founder.find((f) => f.section_key === "why") ?? founder[0];

  return (
    <>
      {/* Hero */}
      <Section className="pb-12 pt-16 sm:pt-24">
        <Container className="text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build your career, product, or next chapter in emerging technologies.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We built Web3Ladies for women like you — curious about what&rsquo;s
            possible, ready to grow, and willing to build a future that feels
            truly your own. Whether you&rsquo;re just starting or already on your
            journey, we&rsquo;re here to help you learn, build, and move forward
            across blockchain, AI, and the future of work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/venture-builder" className={buttonVariants({ size: "lg" })}>
              Join the Venture Builder
            </Link>
            <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Partner With Us
            </Link>
          </div>
        </Container>
      </Section>

      {/* What's happening (Featured) */}
      {featured.length > 0 && (
        <Section className="py-12">
          <Container>
            <SectionHeading
              eyebrow="Featured"
              title="What's happening"
              description="Stay up to date with our latest programs, events, and announcements."
            />
            <div className="mt-10">
              <FeaturedCards items={featured} />
            </div>
          </Container>
        </Section>
      )}

      {/* Mission + Impact */}
      <Section className="bg-warm py-16">
        <Container>
          <SectionHeading
            title="More than a community. A launchpad for women building what's next."
            description="Built with impact. Growing with intention."
          />
          {impact.length > 0 && (
            <div className="mt-12">
              <ImpactStats stats={impact} />
            </div>
          )}
        </Container>
      </Section>

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
          <SectionHeading eyebrow="What we offer" title="What we offer" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERINGS.map((o) => (
              <Card key={o.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <o.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{o.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{o.body}</p>
                  <Link href={o.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Coming soon: Cohorts + Web3Ladies Circle */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {COMING_SOON.map((c) => (
              <Card key={c.title} className="h-full border-primary/20">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <c.icon className="size-5" />
                    </span>
                    <Badge variant="muted">{c.label}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{c.body}</p>
                  <Link href={c.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    {c.cta}
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
          <SectionHeading eyebrow="Choose your path" title="Choose your path" />
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
          <SectionHeading align="left" title="Who this is for" className="max-w-none" />
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

      {/* Our flagship experience */}
      <Section className="bg-warm py-16">
        <Container className="max-w-3xl text-center">
          <SectionHeading eyebrow="Our flagship experience" title="Web3 x AI Venture Builder" />
          <p className="mt-6 text-muted-foreground">
            A high-conviction, application-based program for women building
            future-ready careers, products, and opportunities across Web3, AI,
            and the future of work.
          </p>
          <div className="mt-8">
            <Link href="/venture-builder" className={buttonVariants({ size: "lg" })}>
              Join the Venture Builder
            </Link>
          </div>
        </Container>
      </Section>

      {/* Access that multiplies (sponsorship) */}
      <Section className="py-16">
        <Container className="max-w-3xl text-center">
          <SectionHeading title="Access that multiplies" />
          <p className="mt-6 text-muted-foreground">
            Fund scholarship seats and work tools, and help widen access for
            women building in emerging technology. Every partnership maps to a
            concrete outcome.
          </p>
          <div className="mt-8">
            <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Partner With Us
            </Link>
          </div>
        </Container>
      </Section>

      {/* What makes us different */}
      <Section className="bg-warm py-16">
        <Container>
          <SectionHeading title="What makes us different" />
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

      {/* Final CTA */}
      <CTASection
        title="Ready to build what's next?"
        description="Join the community, apply to the Venture Builder, or partner with us."
        primary={{ label: "Join the Venture Builder", href: "/venture-builder" }}
        secondary={{ label: "Partner With Us", href: "/partner" }}
      />

      {/* Founder's Story */}
      {whyWeExist && (
        <Section className="py-16">
          <Container className="max-w-3xl text-center">
            <SectionHeading
              eyebrow="Founder's Story"
              title={whyWeExist.heading ?? "Why Web3Ladies exists"}
            />
            {whyWeExist.body && (
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {whyWeExist.body}
              </p>
            )}
          </Container>
        </Section>
      )}

      {/* Proof of work (Social proof) */}
      {social.length > 0 && (
        <Section className="bg-warm py-16">
          <Container>
            <SectionHeading title="Proof of work — Women in our community are winning" />
            <div className="mt-12">
              <SocialProof items={social} />
            </div>
          </Container>
        </Section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="py-16">
          <Container>
            <SectionHeading title="Real stories from women in our community" />
            <div className="mt-12">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Section>
      )}

      {/* Newsletter */}
      <Section className="bg-warm py-16">
        <Container className="max-w-2xl text-center">
          <SectionHeading title="We don't do generic newsletters. This one is built for you." />
          <div className="mt-8">
            <NewsletterSubscribe buttonLabel="I'm In, Subscribe Free" />
          </div>
        </Container>
      </Section>
    </>
  );
}
