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
