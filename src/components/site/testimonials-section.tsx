"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TestimonialCard = {
  highlight: string;
  quote: string;
  name: string;
  role: string;
  category?: string | null;
};

export const DEFAULT_TESTIMONIALS: TestimonialCard[] = [
  {
    highlight:
      "I can gladly say I'm a community-taught solidity developer, thanks to Web3Ladies!",
    quote:
      "Over the past couple of months, I have witnessed sporadic growth in my tech journey and this is owing to the amazing mentorship Web3Ladies provided me.",
    name: "Oluwadamilola",
    role: "Solidity Developer",
    category: "Mentorship",
  },
  {
    highlight:
      "Consistency and having the right energy makes you excel — we won a prize on the Celo hack!",
    quote:
      "Am excited to share our victory of winning a prize pool on our project #ChopConnect on the just concluded Celo hack on MiniPay, thanks to Web3Ladies.",
    name: "Nofisat Abiodun Ayanlola",
    role: "Hackathon Winner",
    category: "Hackathon",
  },
  {
    highlight:
      "Thank you so much @web3ladies — this means a whole lot to me. I got my worktool alreadyyyy!",
    quote:
      "The Work Tool Assistance Program gave me the device I needed to keep building. Without it, I would have been stuck watching from the sidelines.",
    name: "Eniola",
    role: "Community Member",
    category: "Worktool",
  },
  {
    highlight:
      "I am thrilled to say that the reality is here — I just received my gift of an HP laptop from Web3Ladies!",
    quote:
      "Activate tool for more work. All my roadmap to this resilience — am grateful to Web3Ladies and everyone who made this possible.",
    name: "Nofisat",
    role: "Worktool Recipient",
    category: "Worktool",
  },
  {
    highlight:
      "My team won the $1,500 prize pool at Web3 Lagos Conference under Lisk protocol!",
    quote:
      "Thank you Web3Ladies — you all played significant roles in making this win possible. The skills and community gave me the foundation to compete and deliver.",
    name: "Amarachiugwu",
    role: "Hackathon Winner",
    category: "Hackathon",
  },
  {
    highlight:
      "I was inspired to create a YouTube video about Sign In With Ethereum after a Web3Ladies workshop.",
    quote:
      "After joining a workshop by Johanna Fransson hosted by Web3Ladies on SIWE, I discussed the motivation and goal of sign in with Ethereum and the great options it brings.",
    name: "Amarachiugwu",
    role: "Content Creator & Developer",
    category: "Workshop",
  },
  {
    highlight:
      "The mentorship helped me develop my organizational and technical skills along with personal development.",
    quote:
      "I had the pleasure to be a mentee at Web3Ladies Cohort II for 4 months without prior knowledge of HTML, CSS, and JavaScript. The mentors have deep knowledge of teaching technical courses.",
    name: "Elizabeth",
    role: "Web Developer",
    category: "Mentorship",
  },
  {
    highlight:
      "The cohort made me more eager to learn and provided me with a community to learn with.",
    quote:
      "Prior to the cohort I had tried learning web3 development 2 times but didn't remain consistent until I got into the cohort that provided me with people to look up to.",
    name: "Amarachi",
    role: "Web3 Developer",
    category: "Cohort",
  },
  {
    highlight:
      "I knew nothing about Crypto. I never traded crypto in my life. Now I am here.",
    quote:
      "I had so many challenges but in the end, I bought my first coin during class. I also started saving in USDT. I am very grateful for the cohort.",
    name: "Amarachukwu",
    role: "Crypto/DeFi Enthusiast",
    category: "Cohort",
  },
];

export function TestimonialsSection({
  testimonials = DEFAULT_TESTIMONIALS,
  heading = "Real stories from women in our community",
  highlightWord = "community",
  showCTA = true,
  ctaText = "Join the Community",
  ctaLink = "/community",
}: {
  testimonials?: TestimonialCard[];
  heading?: string;
  highlightWord?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
}) {
  const parts = heading.split(highlightWord);

  return (
    <section className="py-24 relative overflow-hidden bg-section-rose">
      <div className="blob-decoration w-[350px] h-[350px] bg-coral left-[-120px] top-[20%]" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-foreground">
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-primary">{highlightWord}</span>
                {parts[1]}
              </>
            ) : (
              heading
            )}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-rose/15 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-primary/20" />
                {t.category && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {t.category}
                  </span>
                )}
              </div>
              <p className="font-display font-semibold text-foreground mb-3 leading-snug">
                &quot;{t.highlight}&quot;
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                {t.quote}
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {showCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href={ctaLink}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full px-8 border-foreground/20 group",
              )}
            >
              {ctaText}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
