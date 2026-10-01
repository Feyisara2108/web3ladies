import Link from "next/link";

const QUICK_LINKS = [
  { label: "Venture Builder", href: "/venture-builder" },
  { label: "Cohorts", href: "/cohorts" },
  { label: "Membership", href: "/membership" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Partner", href: "/partner" },
  { label: "News", href: "/news" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/web3ladies/" },
  { label: "X", href: "https://x.com/Web3Ladies" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/web3ladies/" },
  { label: "YouTube", href: "https://www.youtube.com/@Web3Ladies" },
  { label: "TikTok", href: "https://www.tiktok.com/@web3ladies" },
];

const PRESS_KIT = [
  { label: "Logo (Full)", href: "/press-kit/web3ladies-logo-full.jpg" },
  { label: "Icon (Purple)", href: "/press-kit/web3ladies-icon-purple.png" },
  { label: "Icon (Gradient)", href: "/press-kit/web3ladies-icon-gradient.png" },
  { label: "Icon (White)", href: "/press-kit/web3ladies-icon-white-dark-bg.png" },
  { label: "Colour Guide", href: "/press-kit/web3ladies-colour-guide.jpg" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/web3ladies-logo-Cd0zWIm7.png"
                alt="Web3Ladies"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-lg text-foreground">
                Web3<span className="text-primary">Ladies</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping women across Africa and the UAE build skills, products, and
              opportunities in blockchain, AI, and emerging technology.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-4">
              Contact
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We would love to work with you. For partnerships, media enquiries,
              and sponsorship conversations, reach out directly at{" "}
              <a
                href="mailto:hello@web3ladies.com"
                className="text-primary hover:underline font-medium"
              >
                hello@web3ladies.com
              </a>
            </p>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">
              Press Kit
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Logos, icons, and brand colours for media use.
            </p>
            <div className="flex flex-col gap-1.5">
              {PRESS_KIT.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  download
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  ↓ {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Web3Ladies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
