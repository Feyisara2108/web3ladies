/** Row shapes for CMS-managed content (mirror the SQL schema). */

export type FeaturedItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  position: number;
  is_published: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  category: string | null;
  placement: string;
  avatar_url: string | null;
  position: number;
  is_published: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  event_type: string | null;
  description: string | null;
  event_date: string | null;
  location: string | null;
  status: string;
  recording_url: string | null;
  register_url: string | null;
  image_url: string | null;
  position: number;
  is_published: boolean;
};

export type Cohort = {
  id: string;
  title: string;
  description: string | null;
  track: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  apply_url: string | null;
  position: number;
  is_published: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  is_published: boolean;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  category: string;
  position: number;
  is_published: boolean;
};

export type SocialProof = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  source_url: string | null;
  image_url: string | null;
  position: number;
  is_published: boolean;
};

export type ImpactStat = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  position: number;
  is_published: boolean;
};

export type FounderSection = {
  id: string;
  section_key: string | null;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  position: number;
  is_published: boolean;
};

export type FormFieldOption = { id: string; label: string; value: string; position: number };

export type FormField = {
  id: string;
  form_id: string;
  name: string;
  label: string;
  field_type: "text" | "email" | "textarea" | "select" | "checkbox" | "tel" | "url" | "number";
  placeholder: string | null;
  help_text: string | null;
  is_required: boolean;
  position: number;
  options?: FormFieldOption[];
};

export type FormConfig = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  submit_label: string;
  success_message: string;
  is_active: boolean;
  position: number;
  fields: FormField[];
};

/* ── Original (Lovable) schema — used by the faithful page ports ── */

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
