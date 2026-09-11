"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, PRIMARY_CTAS } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/public/logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:ml-auto lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={PRIMARY_CTAS.joinCommunity.href}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {PRIMARY_CTAS.joinCommunity.label}
          </Link>
          <Link
            href={PRIMARY_CTAS.applyNow.href}
            className={buttonVariants({ size: "sm" })}
          >
            {PRIMARY_CTAS.applyNow.label}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={PRIMARY_CTAS.joinCommunity.href}
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "outline" })}
              >
                {PRIMARY_CTAS.joinCommunity.label}
              </Link>
              <Link
                href={PRIMARY_CTAS.applyNow.href}
                onClick={() => setOpen(false)}
                className={buttonVariants({})}
              >
                {PRIMARY_CTAS.applyNow.label}
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
