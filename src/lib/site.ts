/**
 * Site-wide constants derived from the live Web3Ladies site (nav, footer,
 * socials, contact). These are structural chrome, not CMS-managed content.
 */

export const SITE = {
  name: "Web3Ladies",
  email: "hello@web3ladies.com",
  tagline:
    "Helping women across Africa and the UAE build skills, products, and opportunities in blockchain, AI, and emerging technology.",
} as const;

/** Primary navbar links (order matches the live site). */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Venture Builder", href: "/venture-builder" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "News", href: "/news" },
  { label: "Partner", href: "/partner" },
] as const;

/** Footer "Quick Links" (includes Cohorts + Membership per the live footer). */
export const FOOTER_LINKS = [
  { label: "Venture Builder", href: "/venture-builder" },
  { label: "Cohorts", href: "/cohorts" },
  { label: "Membership", href: "/membership" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Partner", href: "/partner" },
  { label: "News", href: "/news" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/web3ladies/" },
  { label: "X", href: "https://x.com/Web3Ladies" },
  { label: "LinkedIn", href: "https://linkedin.com/company/web3ladies/" },
  { label: "YouTube", href: "https://youtube.com/@Web3Ladies" },
  { label: "TikTok", href: "https://tiktok.com/@web3ladies" },
] as const;

/** Primary CTAs shown in the navbar. */
export const PRIMARY_CTAS = {
  joinCommunity: { label: "Join Community", href: "/community" },
  applyNow: { label: "Apply Now", href: "/venture-builder" },
} as const;
