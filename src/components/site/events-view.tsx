"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CircleCheckBig,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  MessageSquare,
  Mic,
  Play,
  Presentation,
  Sparkles,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { EventRow } from "@/lib/types";
import { fadeUp } from "./motion";
import { ConfigForm } from "./config-form";
import { LocalDate } from "./local-date";

const IMG_SPEAKERS = "/assets/w3l-speakers-DyBVY_GC.jpg";
const IMG_BADGES = "/assets/w3l-badges-2-DvLi6Wea.jpg";
const IMG_MERCH = "/assets/w3l-merch-3cGK126J.jpg";
const IMG_PANEL = "/assets/w3l-panel-380aDk8K.jpg";
const IMG_AUDIENCE = "/assets/w3l-audience-CMCtP2Fb.jpg";

const PILLARS = [
  {
    icon: Globe,
    title: "Web3 x AI Direction & Ecosystem",
    desc: "Onchain products, payments, stablecoins, smart contracts, protocol infrastructure, AI integrations, and where the industry is headed.",
  },
  {
    icon: DollarSign,
    title: "Income & Financial Readiness",
    desc: "Money Moves 101, investing basics, negotiation, earning models, scam awareness, and work readiness.",
  },
  {
    icon: Eye,
    title: "Brand & Visibility",
    desc: "Brand OS, writing rooms, speaker track, thought leadership, and public profile positioning.",
  },
  {
    icon: Heart,
    title: "Community & Storytelling",
    desc: 'Founder AMAs, spotlights, fireside chats, and high-trust intimate formats like "Audacity to Thrive."',
  },
  {
    icon: Sparkles,
    title: "Career Movement & Work Readiness",
    desc: "Job search, portfolio building, Web3 career mapping, and professional confidence.",
  },
];

const FORMATS = [
  { icon: BookOpen, label: "Technical workshops" },
  { icon: Mic, label: "Founder AMAs" },
  { icon: MessageSquare, label: "Panel conversations" },
  { icon: Users, label: "Career talks" },
  { icon: Calendar, label: "Community meetups" },
  { icon: Presentation, label: "Demo sessions" },
  { icon: Lightbulb, label: "Masterclass" },
  { icon: Sparkles, label: "Special focus events" },
];

const MOMENTS = [
  { src: IMG_PANEL, alt: "Web3Ladies panel conversation at IWD event" },
  { src: IMG_AUDIENCE, alt: "Web3Ladies community member speaking at event" },
  { src: IMG_BADGES, alt: "Web3Ladies event badges" },
  { src: IMG_MERCH, alt: "Web3Ladies branded merchandise" },
];

const HOST_BENEFITS = [
  "Access to an audience of 20,000+ women across platforms",
  "Co-branded promotion across Web3Ladies channels",
  "Experienced event support and moderation",
  "Post-event visibility and content distribution",
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function EventCard({
  event,
  index,
  onSelect,
}: {
  event: EventRow;
  index: number;
  onSelect: (e: EventRow) => void;
}) {
  const cover = event.gallery_images?.[0] ?? event.image_url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors cursor-pointer group"
      onClick={() => onSelect(event)}
    >
      {cover ? (
        <img src={cover} alt={event.title} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-muted flex items-center justify-center">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-5 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {event.event_type && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {event.event_type}
            </span>
          )}
          {event.status === "past" && event.recording_url && (
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              Recording available
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.event_date && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />{" "}
            <LocalDate
              iso={event.event_date}
              options={{ month: "short", day: "numeric", year: "numeric" }}
            />
          </p>
        )}
        {event.location && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {event.location}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function EventsView({ events, eventId }: { events: EventRow[]; eventId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<EventRow | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const upcoming = events.filter((e) => e.status !== "past");
  const past = events.filter((e) => e.status === "past");
  const linked = eventId && eventId !== dismissedId ? events.find((e) => e.id === eventId) : undefined;
  const active = selected ?? linked ?? null;

  const close = () => {
    setSelected(null);
    if (eventId) {
      setDismissedId(eventId);
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground"
              >
                Events that connect women to ideas, people, and possibility
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                From workshops and AMAs to masterclasses and conversations, our events are
                designed to help women learn, connect, and grow in emerging technology.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="rounded-full px-8" onClick={() => scrollTo("upcoming-events")}>
                  See Upcoming Events <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-primary/20"
                  onClick={() => scrollTo("host")}
                >
                  Host an Event
                </Button>
              </motion.div>
            </div>
            <motion.img
              src={IMG_SPEAKERS}
              alt="Web3Ladies speakers at event"
              className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] hidden lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Events with purpose
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our events are not random — they are the public delivery layer of our
              strategic pillars. Every event serves one or more of these functions:
              educate, increase readiness, increase visibility, build career confidence,
              connect women to opportunities, or move people into deeper Web3Ladies
              pathways.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-14"
          >
            Five event pillars we run consistently
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 hover:border-primary/20 transition-colors"
              >
                <p.icon className="w-7 h-7 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
          >
            Event formats
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {FORMATS.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 hover:border-primary/20 transition-colors"
              >
                <f.icon className="w-6 h-6 text-primary mx-auto" />
                <p className="text-sm font-medium text-foreground">{f.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-display font-bold text-foreground text-center mb-10"
          >
            Moments from our events
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOMENTS.map((m, i) => (
              <motion.img
                key={i}
                src={m.src}
                alt={m.alt}
                className="rounded-2xl shadow-lg w-full object-cover aspect-square"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why events matter */}
      <section className="py-16 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.img
              src={IMG_PANEL}
              alt="Web3Ladies panel discussion"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[3/2]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            />
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-foreground">Why events matter</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sometimes what changes a career is one room, one insight, one mentor, one
                introduction, or one honest conversation. Our events are built to create
                those moments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Host */}
      <section id="host" className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div {...fadeUp} className="space-y-6">
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Host with us
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
                Host an event with Web3Ladies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Want to bring a workshop, panel, AMA, or community conversation to life? We
                partner with organizations, ecosystems, and individuals who want to create
                meaningful spaces for women in tech.
              </p>
              <div className="space-y-3 pt-2">
                {HOST_BENEFITS.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CircleCheckBig className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <ConfigForm formType="event_host" fieldsOnly />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section id="upcoming-events" className="py-20 lg:py-28 px-6 bg-section-alt">
        <div className="container mx-auto max-w-5xl space-y-8">
          <motion.h2 {...fadeUp} className="text-3xl font-display font-bold text-foreground text-center">
            Upcoming Events
          </motion.h2>
          {upcoming.length === 0 ? (
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-dashed border-border bg-card p-12 space-y-4 text-center max-w-3xl mx-auto"
            >
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-display font-semibold text-lg text-foreground">
                Upcoming events will appear here
              </h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for new workshops, AMAs, and community events.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="py-20 lg:py-28 px-6">
          <div className="container mx-auto max-w-5xl space-y-8">
            <motion.h2 {...fadeUp} className="text-3xl font-display font-bold text-foreground text-center">
              Past Events
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} onSelect={setSelected} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event details */}
      {active && (
        <Dialog open={!!active} onOpenChange={close}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">{active.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-sm">
                {active.event_type && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {active.event_type}
                  </span>
                )}
                {active.status && (
                  <span
                    className={`px-3 py-1 rounded-full capitalize ${active.status === "past" ? "bg-muted text-muted-foreground" : "bg-green-100 text-green-700"}`}
                  >
                    {active.status}
                  </span>
                )}
                {active.is_virtual && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Virtual</span>
                )}
              </div>
              {active.event_date && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />{" "}
                  <LocalDate
                    iso={active.event_date}
                    options={{ weekday: "long", year: "numeric", month: "long", day: "numeric" }}
                  />
                </p>
              )}
              {active.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {active.location}
                </p>
              )}
              {active.description && (
                <p className="text-muted-foreground leading-relaxed">{active.description}</p>
              )}
              {(active.gallery_images?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">Event Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {active.gallery_images!.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${active.title} gallery ${i + 1}`}
                        className="rounded-lg w-full aspect-square object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {active.registration_url && active.status !== "past" && (
                  <a
                    href={active.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants(), "rounded-full")}
                  >
                    Register <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                )}
                {active.recording_url && (
                  <a
                    href={active.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-primary/20")}
                  >
                    <Play className="mr-2 w-4 h-4" /> Watch Recording
                  </a>
                )}
                {active.report_url && (
                  <a
                    href={active.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-primary/20")}
                  >
                    <FileText className="mr-2 w-4 h-4" /> Event Report
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Closing */}
      <section className="py-20 lg:py-28 px-6">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Don&apos;t just follow the conversation. Step into it.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" onClick={() => scrollTo("upcoming-events")}>
              Attend an Event
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-primary/20"
              onClick={() => scrollTo("host")}
            >
              Host an Event
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
