import Link from "next/link";
import type { SVGProps } from "react";
import { Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/public/logo";
import { SITE, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/site";

// Brand glyphs as inline SVGs (lucide 1.x removed brand icons).
type IconType = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

const Instagram: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.85-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z" />
  </svg>
);
const XIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.2-6.82-5.96 6.82H1.7l7.73-8.84L1.55 2.25h6.83l4.71 6.23 5.15-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
  </svg>
);
const LinkedIn: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
  </svg>
);
const YouTube: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
  </svg>
);
const TikTok: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.02a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 1 1 .8-5.07V8.1a5.9 5.9 0 1 0 5.1 5.84V8.66a7.53 7.53 0 0 0 4.4 1.4V6.76a4.28 4.28 0 0 1-3.34-.94Z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, IconType> = {
  Instagram,
  X: XIcon,
  LinkedIn,
  YouTube,
  TikTok,
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-warm">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 — logo + mission */}
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {SITE.tagline}
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Connect */}
        <div>
          <h4 className="text-sm font-semibold">Connect</h4>
          <ul className="mt-4 space-y-2">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICONS[s.label] ?? Instagram;
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="size-4" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4 — Contact + Press Kit */}
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <p className="mt-4 text-sm text-muted-foreground">
            We would love to work with you. For partnerships, media enquiries,
            and sponsorship conversations, reach out directly at
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
          >
            {SITE.email}
          </a>
          <h4 className="mt-6 text-sm font-semibold">Press Kit</h4>
          <ul className="mt-3 space-y-2">
            {[
              "Logo (Full)",
              "Icon (Purple)",
              "Icon (Gradient)",
              "Icon (White)",
              "Colour Guide",
            ].map((label) => (
              <li key={label}>
                <a
                  href="/assets/web3ladies-logo-Cd0zWIm7.png"
                  download
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Download className="size-4 shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-center gap-2 py-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
