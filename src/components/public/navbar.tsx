"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Venture Builder", href: "/venture-builder" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "News", href: "/news" },
  { label: "Partner", href: "/partner" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/web3ladies-logo-Cd0zWIm7.png"
            alt="Web3Ladies logo"
            className="w-9 h-9 object-contain"
          />
          <span className="font-display font-bold text-lg text-foreground">
            Web3<span className="text-primary">Ladies</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition-colors ${pathname === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/community"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full px-5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary",
            )}
          >
            Join Community
          </Link>
          <Link
            href="/venture-builder"
            className={cn(buttonVariants({ size: "sm" }), "rounded-full px-5")}
          >
            Apply Now
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-foreground"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <div className="flex flex-col gap-4 p-6">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`font-medium transition-colors ${pathname === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/community"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full px-5 border-primary/30",
                  )}
                >
                  Join Community
                </Link>
                <Link
                  href="/venture-builder"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "sm" }), "rounded-full px-5")}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
