import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { NewsletterSubscribe } from "@/components/public/newsletter-subscribe";
import { getBlogPosts } from "@/lib/queries";

export const metadata = { title: "News — Web3Ladies" };

const COVERAGE = [
  "Program announcements",
  "Event recaps",
  "Ecosystem insights",
  "Career stories",
  "AI x Web3 commentary",
];

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NewsPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            News, insights, and what's shaping the future
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Program updates, event announcements, ecosystem insights, and
            community opportunities.
          </p>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <SectionHeading eyebrow="What we cover" title="Stories worth your time" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {COVERAGE.map((c) => (
              <span key={c} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{c}</span>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-8">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Card key={p.id} className="h-full">
                  <CardContent className="flex h-full flex-col gap-2 p-6">
                    {p.published_at && (
                      <span className="text-xs text-muted-foreground">{formatDate(p.published_at)}</span>
                    )}
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    {p.excerpt && <p className="flex-1 text-sm text-muted-foreground">{p.excerpt}</p>}
                    <Link href={`/news/${p.slug}`} className="text-sm font-medium text-primary hover:underline">
                      Read more
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-12 text-center">
              <h3 className="font-display text-xl font-semibold">Stories and insights coming soon</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We're just getting started. Subscribe below to get updates that
                actually help you grow.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-warm py-16">
        <Container className="max-w-2xl text-center">
          <SectionHeading title="Get updates that actually help you grow" />
          <div className="mt-8">
            <NewsletterSubscribe />
          </div>
        </Container>
      </Section>
    </>
  );
}
