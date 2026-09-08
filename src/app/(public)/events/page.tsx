import { Container, Section } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/public/section-heading";
import { DynamicForm } from "@/components/public/dynamic-form";
import { getEvents, getFormConfig } from "@/lib/queries";
import type { EventItem } from "@/lib/types";

export const metadata = { title: "Events — Web3Ladies" };

// Verbatim from the live site — see docs/live-content-reference.md
const PILLARS = [
  { t: "Web3 x AI Direction & Ecosystem", d: "Onchain products, payments, stablecoins, smart contracts, protocol infrastructure, AI integrations, and where the industry is headed." },
  { t: "Income & Financial Readiness", d: "Money Moves 101, investing basics, negotiation, earning models, scam awareness, and work readiness." },
  { t: "Brand & Visibility", d: "Brand OS, writing rooms, speaker track, thought leadership, and public profile positioning." },
  { t: "Community & Storytelling", d: "Audacity to Thrive." },
  { t: "Career Movement & Work Readiness", d: "Job search, portfolio building, Web3 career mapping, and professional confidence." },
];

const FORMATS = [
  "Technical workshops", "Founder AMAs", "Panel conversations", "Career talks",
  "Community meetups", "Demo sessions", "Special focus events",
];

const HOST_BENEFITS = [
  "Co-branded promotion across Web3Ladies channels",
  "Experienced event support and moderation",
  "Post-event visibility and content distribution",
];

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function EventCard({ e }: { e: EventItem }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-2 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {e.event_type && <Badge>{e.event_type}</Badge>}
          {e.status === "past" && <Badge variant="muted">Past</Badge>}
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold">{e.title}</h3>
        {e.description && <p className="flex-1 text-sm text-muted-foreground">{e.description}</p>}
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {formatDate(e.event_date) && <span>{formatDate(e.event_date)}</span>}
          {e.location && <span>· {e.location}</span>}
        </div>
        {e.recording_url && (
          <a href={e.recording_url} className="mt-1 text-sm font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Watch recording
          </a>
        )}
        {e.register_url && e.status !== "past" && (
          <a href={e.register_url} className="mt-1 text-sm font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Save my spot
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default async function EventsPage() {
  const [events, config] = await Promise.all([getEvents(), getFormConfig("event_host_request")]);
  const upcoming = events.filter((e) => e.status !== "past");
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Events that connect women to ideas, people, and possibility
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Educational gatherings — from workshops to masterclasses — designed
            to help women learn and grow in emerging technology.
          </p>
        </Container>
      </Section>

      <Section className="py-14">
        <Container>
          <SectionHeading eyebrow="What we focus on" title="Our event pillars" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <Card key={p.t} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">{p.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FORMATS.map((f) => (
              <Badge key={f} variant="secondary">{f}</Badge>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-warm py-14">
        <Container>
          <SectionHeading title="Upcoming events" />
          <div className="mt-10">
            {upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => <EventCard key={e.id} e={e} />)}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Check back soon for new workshops, AMAs, and community events.
              </p>
            )}
          </div>
        </Container>
      </Section>

      {past.length > 0 && (
        <Section className="py-14">
          <Container>
            <SectionHeading title="Past events" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => <EventCard key={e.id} e={e} />)}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-warm py-16">
        <Container className="max-w-2xl">
          <SectionHeading
            title="Host with us"
            description="Reach a growing community of women building in emerging technology."
          />
          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2">
            {HOST_BENEFITS.map((b) => (
              <li key={b} className="text-sm text-muted-foreground">• {b}</li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <DynamicForm config={config} formKey="event_host_request" fallbackTitle="Event Host Request" />
          </div>
        </Container>
      </Section>
    </>
  );
}
