/** Row shapes for CMS-managed content (mirror the SQL schema). */

export type FeaturedItemRow = {
  id: string;
  type: string | null;
  title: string;
  description: string | null;
  href: string | null;
  cta: string | null;
  badge: string | null;
  icon: string | null;
  display_order: number;
  is_published: boolean;
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  is_virtual: boolean | null;
  registration_url: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_published: boolean;
  status: string | null;
  recording_url: string | null;
  report_url: string | null;
  gallery_images: string[] | null;
  platform: string | null;
};

export type PartnerRow = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  category: string | null;
  report_url: string | null;
  report_label: string | null;
  description: string | null;
  display_order: number;
  is_published: boolean;
};

export type SocialProofRow = {
  id: string;
  image_url: string | null;
  caption: string;
  tag: string | null;
  display_order: number;
  is_published: boolean;
};

export type FounderStoryRow = {
  id: string;
  name: string;
  title: string | null;
  story: string | null;
  quote: string | null;
  image_url: string | null;
};

/** Card shape shared by the homepage "Featured" carousel. */
export type FeaturedCard = {
  type: string | null;
  title: string;
  description: string | null;
  href: string | null;
  cta: string | null;
  badge: string | null;
  icon: string | null;
  image: string | null;
  /** Featured events without a description show "<type> — <date>", formatted in the browser. */
  eventDate?: string | null;
};

export type ImpactHighlightRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  report_url: string | null;
  report_label: string | null;
  display_order: number;
  is_published: boolean;
};

export type ImpactStatRow = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  page: string | null;
  display_order: number;
  is_published: boolean;
};
