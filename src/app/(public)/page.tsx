import Link from "next/link";
import Image from "next/image";
import {
  Rocket,
  Wrench,
  CalendarDays,
  Heart,
  Users,
  Crown,
  Sparkles,
  Target,
  Compass,
  Handshake,
  Megaphone,
  Presentation,
  Globe,
  Star,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";
import { ImpactStats } from "@/components/public/impact-stats";
import { PartnersMarquee } from "@/components/public/partners-marquee";
import { Testimonials } from "@/components/public/testimonials";
import { ProofCarousel } from "@/components/public/proof-carousel";
import { NewsletterSubscribe } from "@/components/public/newsletter-subscribe";
import {
  getFeaturedItems,
  getImpactStats,
  getPartners,
  getFounderStory,
  getSocialProof,
  getTestimonials,
} from "@/lib/queries";

// Verbatim copy from the live site — see docs/live-content-reference.md.
const STRIP_PHOTOS = [
  "/assets/w3l-audience-CMCtP2Fb.jpg",
  "/assets/w3l-panel-380aDk8K.jpg",
  "/assets/w3l-speakers-DyBVY_GC.jpg",
  "/assets/w3l-team-DGAT43mi.jpg",
];

const FEATURED_ICON: Record<string, typeof Rocket> = {
  Program: Rocket,
  Initiative: Wrench,
  Panel: Presentation,
};

const OFFERINGS = [
  { icon: Rocket, title: "Web3 x AI Venture Builder", body: "A hands-on experience for women building future-facing careers, products, and ventures at the intersection of blockchain, AI, and the future of work." },
  { icon: Wrench, title: "Worktool Grants", body: "Sponsor-backed work tool support for selected women builders — laptops, internet, software access, and essential resources to keep building." },
  { icon: CalendarDays, title: "Events", body: "Workshops, AMAs, masterclasses, meetups, and conversations that connect women to real ideas, real builders, and real opportunities." },
  { icon: Heart, title: "Community", body: "A support system for ambitious women navigating learning, transition, visibility, accountability, and growth in emerging technology." },
];

const PATHS = [
  { icon: Heart, title: "Join the Community", body: "Free access to our global network of women learning and building in emerging technology.", cta: "Join Free", href: "/community" },
  { icon: Rocket, title: "Apply to Venture Builder", body: "Our flagship paid program — build your MVP, grow your skills, and demo what you create.", cta: "Apply Now", href: "/venture-builder" },
  { icon: Handshake, title: "Sponsor a Seat", body: "Fund a scholarship seat and help widen access for women building in emerging tech.", cta: "Sponsor", href: "/partner" },
  { icon: Megaphone, title: "Host an Event", body: "Partner with us to host a workshop, AMA, meetup, or community conversation for women in tech.", cta: "Host With Us", href: "/events" },
];

const AUDIENCES = [
  { icon: Compass, text: "Women exploring careers in blockchain, AI, and emerging technology" },
  { icon: Users, text: "Early-career builders looking for structure, community, and direction" },
  { icon: Target, text: "Technical professionals growing into deeper specialization" },
  { icon: Rocket, text: "Founders and aspiring founders building future-facing products" },
  { icon: Sparkles, text: "Women who already have a career in finance, law, healthcare, education, or anywhere else, and are ready to bring blockchain or AI into what they already know how to do" },
];

const DIFFERENTIATORS = [
  { icon: Globe, text: "We are future-focused — always preparing women for the future of work, opportunity, and impact" },
  { icon: Target, text: "We care about practical outcomes, not just motivational language" },
  { icon: Users, text: "We combine skills, mentorship, exposure, and community support" },
  { icon: Star, text: "We are building a space where women can learn, build, lead, and be seen" },
];

const NEWSLETTER_PERKS = [
  "First access to program openings and cohort announcements before we go public",
  "Event invites, workshop schedules, and AMA drops straight to your inbox",
  "Funding opportunities, grants, and ecosystem news curated for women builders",
  "Honest stories from women in our community who are building real things right now",
];

const FOUNDER_FALLBACK =
  "I started Web3Ladies because when I transitioned into blockchain, I could clearly see two things at the same time: the immense opportunity Web3 was creating, new careers, new economies, new ways of building, and a painful gap: there were not enough women in the room, especially women who looked like me.";

export default async function HomePage() {
  const [featured, impact, partners, founder, social, testimonials] =
    await Promise.all([
      getFeaturedItems(),
      getImpactStats(),
      getPartners(),
      getFounderStory(),
      getSocialProof(),
      getTestimonials(),
    ]);

  const whyWeExist = founder.find((f) => f.section_key === "why") ?? founder[0];

  return (
    <>
      {/* 1 — HERO */}
      <Section className="pb-12 pt-14 sm:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Build your career, product, or next chapter in{" "}
              <span className="text-primary">emerging technologies.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              We built Web3Ladies for women like you — curious about what&rsquo;s
              possible, ready to grow, and willing to build a future that feels
              truly your own. Whether you&rsquo;re just starting or already on
              your journey, we&rsquo;re here to help you learn, build, and move
              forward across blockchain, AI, and the future of work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/venture-builder" className={buttonVariants({ size: "lg" })}>
                Join the Venture Builder <ArrowRight className="size-4" />
              </Link>
              <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Partner With Us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src="/assets/w3l-community-CnAOSAwg.jpg"
                alt="Web3Ladies community"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="animate-float absolute -bottom-8 left-6 rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="font-display text-2xl font-bold text-primary">20,000+</div>
              <div className="text-xs text-muted-foreground">women reached across platforms</div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 2 — PHOTO STRIP */}
      <Section className="py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STRIP_PHOTOS.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                <Image src={src} alt="" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                <span className="sr-only">Web3Ladies photo {i + 1}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3 — FEATURED */}
      {featured.length > 0 && (
        <Section className="bg-warm py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="What's happening" title="Featured" description="Stay up to date with our latest programs, events, and announcements." />
            </Reveal>
            <Reveal delay={120} className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((f) => {
                const Icon = (f.category && FEATURED_ICON[f.category]) || Sparkles;
                return (
                  <Card key={f.id} className="h-full">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </span>
                        {f.category && <Badge>{f.category}</Badge>}
                      </div>
                      <h3 className="font-display text-lg font-semibold leading-tight">{f.title}</h3>
                      {f.description && <p className="flex-1 text-sm text-muted-foreground">{f.description}</p>}
                      {f.cta_url && (
                        <Link href={f.cta_url} className="group inline-flex items-center gap-1 text-sm font-medium text-primary">
                          {f.cta_label ?? "Learn More"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Reveal>
          </Container>
        </Section>
      )}

      {/* 4 — MORE THAN A COMMUNITY */}
      <Section className="py-16">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              More than a community. <span className="text-primary">A launchpad</span> for women building what&rsquo;s next.
            </h2>
            <p className="mt-6 text-muted-foreground">
              We work with women across Africa and the UAE — meeting them where
              they are and helping them go further, faster, together.
            </p>
            <p className="mt-4 text-muted-foreground">
              Everything we do is practical: real programs, real mentorship, and
              real projects that turn curiosity into capability and momentum.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* 5 — STATS */}
      {impact.length > 0 && (
        <Section className="bg-warm py-16">
          <Container>
            <Reveal>
              <SectionHeading title={<>Built with impact. <span className="text-primary">Growing with intention.</span></>} />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <ImpactStats stats={impact} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* 6 — PARTNERS (marquee) */}
      {partners.length > 0 && (
        <Section className="py-14">
          <Container>
            <Reveal className="text-center">
              <SectionHeading title="With these partners" description="Organizations backing women building in Web3, AI, and emerging technology." />
            </Reveal>
          </Container>
          <div className="mt-10">
            <PartnersMarquee partners={partners} />
          </div>
        </Section>
      )}

      {/* 7 — WHAT WE OFFER */}
      <Section className="py-16">
        <Container>
          <Reveal><SectionHeading title="What we offer" /></Reveal>
          <Reveal delay={120} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((o) => (
              <Card key={o.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <o.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{o.title}</h3>
                  <p className="text-sm text-muted-foreground">{o.body}</p>
                </CardContent>
              </Card>
            ))}

            {/* Cohorts — coming back soon */}
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </span>
                  <Badge variant="muted">Coming Back Soon</Badge>
                </div>
                <h3 className="font-display text-lg font-semibold">Cohorts</h3>
                <p className="flex-1 text-sm text-muted-foreground">
                  Our focused learning tracks are coming back and we want you in
                  the room when they do. Drop your email and you&rsquo;ll be the
                  first we call.
                </p>
                <NewsletterSubscribe compact formKey="cohorts_waitlist" buttonLabel="Save My Spot" />
              </CardContent>
            </Card>

            {/* Web3Ladies Circle — coming soon */}
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Crown className="size-5" />
                  </span>
                  <Badge variant="muted">Coming Soon</Badge>
                </div>
                <h3 className="font-display text-lg font-semibold">Web3Ladies Circle</h3>
                <p className="flex-1 text-sm text-muted-foreground">
                  We&rsquo;re building something more intimate for women who are
                  serious about going deeper. If that&rsquo;s you, we want you to
                  know about it before anyone else does.
                </p>
                <NewsletterSubscribe compact formKey="circle_waitlist" buttonLabel="Put Me on the List" />
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* 8 — CHOOSE YOUR PATH */}
      <Section className="bg-warm py-16">
        <Container>
          <Reveal><SectionHeading title="Choose your path" /></Reveal>
          <Reveal delay={120} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((p) => (
              <Card key={p.title} className="h-full">
                <CardContent className="flex h-full flex-col items-start gap-3 p-6">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{p.body}</p>
                  <Link href={p.href} className="group inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {p.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 9 — WHO THIS IS FOR */}
      <Section className="py-16">
        <Container className="max-w-4xl">
          <Reveal><SectionHeading title="Who this is for" description="Whether you are just starting out or already building, Web3Ladies is designed to meet you where you are and help you move forward with clarity." /></Reveal>
          <Reveal delay={120} className="mt-10 space-y-3">
            {AUDIENCES.map((a) => (
              <div key={a.text} className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3.5">
                <a.icon className="size-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground sm:text-base">{a.text}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 10 — FLAGSHIP FEATURE */}
      <Section className="py-16">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Badge className="mb-4">Our flagship experience</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Web3 x AI Venture Builder</h2>
            <p className="mt-4 text-muted-foreground">
              The Web3 x AI Venture Builder is for women who want more than
              passive learning. It is designed for practical growth — helping
              participants learn fast, build confidently, validate ideas, and
              create visible outcomes.
            </p>
            <div className="mt-6">
              <Link href="/venture-builder" className={buttonVariants({ size: "lg" })}>
                Explore the Venture Builder <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <Image src="/assets/w3l-builder-COStughb.jpg" alt="Building on a laptop at Web3Ladies" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 11 — ACCESS THAT MULTIPLIES (cream band) */}
      <Section className="bg-warm-deep py-16">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Handshake className="size-6" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Access that multiplies</h2>
            <p className="mt-4 text-muted-foreground">
              Revenue from our premium programs helps fund scholarship seats,
              work tool support, and broader access for women building in
              emerging technology.
            </p>
            <div className="mt-8">
              <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Learn About Sponsorship
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 12 — WHAT MAKES US DIFFERENT */}
      <Section className="py-16">
        <Container>
          <Reveal><SectionHeading title="What makes us different" /></Reveal>
          <Reveal delay={120} className="mt-12 grid gap-6 sm:grid-cols-2">
            {DIFFERENTIATORS.map((d) => (
              <Card key={d.text} className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <d.icon className="size-6 shrink-0 text-primary" />
                  <p className="font-medium">{d.text}</p>
                </CardContent>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 13 — MID-PAGE CTA */}
      <Section className="py-16">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build <span className="text-primary">what&rsquo;s next?</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join a platform designed to help women move from curiosity to
              confidence — and from confidence to real-world outcomes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/venture-builder" className={buttonVariants({ size: "lg" })}>Join the Venture Builder</Link>
              <Link href="/community" className={buttonVariants({ variant: "outline", size: "lg" })}>Join Community</Link>
              <Link href="/partner" className={buttonVariants({ variant: "outline", size: "lg" })}>Partner With Us</Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 14 — FOUNDER'S STORY */}
      <Section className="py-16">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-muted">
              <Image src={whyWeExist?.image_url ?? "/assets/founder-oluchi-BnQV3JEa.png"} alt="Oluchi Enebeli, Founder of Web3Ladies" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Badge className="mb-4">Founder&rsquo;s Story</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {whyWeExist?.heading ?? "Why Web3Ladies exists"}
            </h2>
            <p className="mt-4 whitespace-pre-line text-muted-foreground">
              {whyWeExist?.body ?? FOUNDER_FALLBACK}
            </p>
            <blockquote className="mt-6 border-l-4 border-primary pl-4 text-lg font-medium italic">
              If the room did not naturally make space for more women, then I
              would help build a bigger room.
            </blockquote>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-semibold">Oluchi Enebeli</div>
                <div className="text-sm text-muted-foreground">Founder, Web3Ladies</div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/community" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Read Full Story <ArrowUpRight className="size-4" />
                </Link>
                <a href="https://www.linkedin.com/company/web3ladies/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 15 — PROOF OF WORK (carousel) */}
      {social.length > 0 && (
        <Section className="py-16">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Proof of work" title={<>Women in our community are <span className="text-primary">winning</span></>} description="Real posts. Real wins. Straight from the women building with us." />
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <ProofCarousel items={social} />
            </Reveal>
          </Container>
        </Section>
      )}

      {/* 16 — TESTIMONIALS (blush band) */}
      {testimonials.length > 0 && (
        <Section className="bg-rose-light py-16">
          <Container>
            <Reveal>
              <SectionHeading title={<>Real stories from women in our <span className="text-primary">community</span></>} />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <Testimonials items={testimonials} />
            </Reveal>
            <div className="mt-10 text-center">
              <Link href="/community" className={buttonVariants({ size: "lg" })}>
                Join the Community <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* 17 — NEWSLETTER */}
      <Section className="py-16">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <SectionHeading title={<>We don&rsquo;t do generic newsletters. This one is built for you.</>} description="We send things that actually matter to women building in emerging tech. Not noise, not filler. If you are serious about staying close to what is happening at the frontier, this is where you want to be." />
            <div className="mx-auto mt-8 max-w-md text-left">
              <p className="text-sm font-semibold">What you&rsquo;ll get:</p>
              <ul className="mt-3 space-y-2">
                {NEWSLETTER_PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <NewsletterSubscribe buttonLabel="I'm In, Subscribe Free" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
