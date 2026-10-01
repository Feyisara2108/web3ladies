import { createClient } from "@/lib/supabase/server";
import type {
  FeaturedItem,
  Testimonial,
  EventItem,
  Cohort,
  BlogPost,
  Partner,
  SocialProof,
  ImpactStat,
  FounderSection,
  FormConfig,
  FeaturedCard,
  FeaturedItemRow,
  EventRow,
  PartnerRow,
  SocialProofRow,
  FounderStoryRow,
} from "@/lib/types";

/**
 * Public content reads. All are resilient: if Supabase isn't configured yet
 * (no env) or a query fails, they return an empty result so the site still
 * renders (with empty states) during setup. Once Supabase is connected and
 * seeded (Phase 6), the same reads light up with real content.
 */

function isConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function selectPublished<T>(
  table: string,
  order: { column: string; ascending?: boolean }[] = [{ column: "position" }],
): Promise<T[]> {
  if (!isConfigured()) return [];
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select("*").eq("is_published", true);
    for (const o of order) query = query.order(o.column, { ascending: o.ascending ?? true });
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as T[];
  } catch (err) {
    console.error(`[queries] failed to read ${table}:`, (err as Error).message);
    return [];
  }
}

export const getFeaturedItems = () => selectPublished<FeaturedItem>("featured_items");
export const getTestimonials = () => selectPublished<Testimonial>("testimonials");
export const getPartners = () => selectPublished<Partner>("partners");
export const getSocialProof = () => selectPublished<SocialProof>("social_proof");
export const getImpactStats = () => selectPublished<ImpactStat>("impact_stats");
export const getFounderStory = () => selectPublished<FounderSection>("founder_story");
export const getCohorts = () => selectPublished<Cohort>("cohorts");

export const getTestimonialsByPlacement = async (placement: string) =>
  (await getTestimonials()).filter((t) => t.placement === placement);

export const getEvents = () =>
  selectPublished<EventItem>("events", [
    { column: "position" },
    { column: "event_date", ascending: false },
  ]);

export const getBlogPosts = () =>
  selectPublished<BlogPost>("blog_posts", [{ column: "published_at", ascending: false }]);

/** Full form config (form + fields + options) for a configurable public form. */
export async function getFormConfig(key: string): Promise<FormConfig | null> {
  if (!isConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data: form, error } = await supabase
      .from("forms")
      .select("*")
      .eq("key", key)
      .eq("is_active", true)
      .single();
    if (error || !form) return null;

    const { data: fields } = await supabase
      .from("form_fields")
      .select("*, options:form_field_options(*)")
      .eq("form_id", form.id)
      .order("position", { ascending: true });

    const normalized = (fields ?? []).map((f) => ({
      ...f,
      options: (f.options ?? []).sort(
        (a: { position: number }, b: { position: number }) => a.position - b.position,
      ),
    }));

    return { ...form, fields: normalized } as FormConfig;
  } catch (err) {
    console.error(`[queries] failed to read form ${key}:`, (err as Error).message);
    return null;
  }
}

/* ── Original (Lovable) schema reads — used by the faithful page ports ── */

type Filter = { column: string; value: string | boolean };

async function fetchRows<T>(
  table: string,
  filters: Filter[],
  order: { column: string; ascending?: boolean },
): Promise<T[]> {
  if (!isConfigured()) return [];
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select("*");
    for (const f of filters) query = query.eq(f.column, f.value);
    const { data, error } = await query.order(order.column, {
      ascending: order.ascending ?? true,
    });
    if (error) throw error;
    return (data ?? []) as T[];
  } catch (err) {
    console.error(`[queries] failed to read ${table}:`, (err as Error).message);
    return [];
  }
}

const published: Filter = { column: "is_published", value: true };

/** Featured items + featured events, merged the same way the live site does. */
export async function getHomeFeatured(): Promise<FeaturedCard[]> {
  const [items, events] = await Promise.all([
    fetchRows<FeaturedItemRow>("featured_items", [published], { column: "display_order" }),
    fetchRows<EventRow>("events", [published, { column: "is_featured", value: true }], {
      column: "event_date",
    }),
  ]);
  return [
    ...items.map((i) => ({
      type: i.type,
      title: i.title,
      description: i.description,
      href: i.href,
      cta: i.cta,
      badge: i.badge,
      icon: i.icon,
      image: null,
    })),
    ...events.map((e) => ({
      type: "event",
      title: e.title,
      description: e.description ?? (e.event_date ? null : (e.event_type ?? "Event")),
      eventDate: e.description ? null : e.event_date,
      href: `/events?event=${e.id}`,
      cta: e.status === "past" ? "View Event" : "Learn More",
      badge: e.event_type ?? "Event",
      icon: "calendar",
      image: e.gallery_images?.[0] ?? e.image_url ?? null,
    })),
  ];
}

export const getPartnersByCategory = (category: string) =>
  fetchRows<PartnerRow>("partners", [published, { column: "category", value: category }], {
    column: "display_order",
  });

export const getSocialProofItems = () =>
  fetchRows<SocialProofRow>("social_proof_items", [published], { column: "display_order" });

export async function getPublishedFounderStory(): Promise<FounderStoryRow | null> {
  const rows = await fetchRows<FounderStoryRow>("founder_story", [published], {
    column: "created_at",
  });
  return rows[0] ?? null;
}

