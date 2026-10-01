"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Quote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FounderStoryRow } from "@/lib/types";

const FOUNDER_IMAGE = "/assets/founder-oluchi-BnQV3JEa.png";
const LINKEDIN_URL = "https://www.linkedin.com/in/koderholic/";

const SHORT_STORY =
  "I started Web3Ladies because when I transitioned into blockchain, I could clearly see two things at the same time: the immense opportunity Web3 was creating, new careers, new economies, new ways of building, and a painful gap: there were not enough women in the room, especially women who looked like me.";

const QUOTE =
  "If the room did not naturally make space for more women, then I would help build a bigger room.";

const FULL_STORY = `I started Web3Ladies because when I transitioned into blockchain, I could clearly see two things at the same time:

First, I saw the immense opportunity that Web3 was creating, new careers, new economies, new ways of building, and a chance for people from places like Africa to participate in global innovation in a much more direct way.

But at the same time, I also saw a painful gap: there were not enough women in the room, especially women who looked like me, came from backgrounds like mine, and were being seen as deeply technical contributors in the space.

In my early days in blockchain, most of the people I learned from, worked with, and looked up to were men. In many of the teams I was part of, I was either the only woman or one of very few. That experience made something very clear to me: representation matters, not just symbolically, but practically. When people can see someone who looks like them building, leading, and thriving in a space, it changes what they believe is possible for themselves.

So I started Web3Ladies because I did not want to only be one of the few women succeeding in Web3. I wanted to help create a world where many more women could enter, grow, lead, and benefit from the opportunities this technology was opening up.

At its core, Web3Ladies was born from a mix of frustration, vision, and responsibility.

Frustration, because I could see the gender gap clearly.
Vision, because I knew blockchain was bigger than hype, it was creating real access and new possibilities.
And responsibility, because once I had found my footing in the industry, I felt called to build the kind of platform and support system I wished existed more visibly when I was starting out.

I wanted women to have more than inspiration. I wanted them to have access:

• Access to education
• Access to mentorship
• Access to tools
• Access to community
• Access to real opportunities

That is the story behind Web3Ladies.

It was never just about creating a community for community's sake. It was about building an ecosystem that could help women move from curiosity to confidence, from confidence to competence, and from competence to real participation and leadership in Web3.

Over time, that vision grew into something much bigger than I imagined. Web3Ladies became one of Africa's largest women-focused Web3 communities, a mission-driven platform equipping women for success in the decentralized web through mentorship, tools, technical upskilling, and access to opportunities.

So the founding story, for me, is deeply personal.

Web3Ladies was born from my own journey of transitioning into an emerging industry, feeling the weight of underrepresentation, and deciding that if the room did not naturally make space for more women, then I would help build a bigger room.`;

const FALLBACK: FounderStoryRow = {
  id: "fallback",
  name: "Oluchi Enebeli",
  title: "Founder, Web3Ladies",
  story: SHORT_STORY,
  quote: QUOTE,
  image_url: FOUNDER_IMAGE,
};

function LinkedInIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function FounderStorySection({ founder }: { founder: FounderStoryRow | null }) {
  const data = founder ?? FALLBACK;
  const [open, setOpen] = useState(false);

  const image = data.image_url || FOUNDER_IMAGE;
  const story = data.id === "fallback" ? SHORT_STORY : data.story || SHORT_STORY;
  const quote = data.id === "fallback" ? QUOTE : data.quote;

  return (
    <>
      <section className="py-20 lg:py-28 px-6 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={image}
                alt={data.name}
                className="rounded-2xl shadow-lg w-full object-cover aspect-[3/4]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Founder&apos;s Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
                Why Web3Ladies exists
              </h2>
              <p className="text-muted-foreground leading-relaxed">{story}</p>
              {quote && (
                <blockquote className="border-l-4 border-primary pl-5 py-2 relative">
                  <Quote className="w-5 h-5 text-primary/40 absolute -top-1 -left-1" />
                  <p className="text-foreground italic leading-relaxed">&quot;{quote}&quot;</p>
                </blockquote>
              )}
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-display font-semibold text-foreground">{data.name}</p>
                  {data.title && <p className="text-sm text-muted-foreground">{data.title}</p>}
                </div>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-primary hover:text-primary/80 transition-colors"
                  aria-label={`${data.name} on LinkedIn`}
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-primary/20 hover:bg-primary/5"
                onClick={() => setOpen(true)}
              >
                Read Full Story
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 sm:p-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-6">
                <div>
                  <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                    Founder&apos;s Story
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    Why Web3Ladies exists
                  </h3>
                </div>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {FULL_STORY}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="font-display font-semibold text-foreground">{data.name}</p>
                    {data.title && <p className="text-sm text-muted-foreground">{data.title}</p>}
                  </div>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
