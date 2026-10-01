import { createClient } from "@/lib/supabase/server";
import type {
  FeaturedCard,
  FeaturedItemRow,
  EventRow,
  PartnerRow,
  SocialProofRow,
  FounderStoryRow,
  ImpactHighlightRow,
  ImpactStatRow,
} from "@/lib/types";

/**
 * Public content reads. All are resilient: if Supabase isn't configured yet
 * (no env) or a query fails, they return an empty result so the site still
 * renders with the live site's built-in defaults. Table and column names
 * match the original (Lovable) schema.
 */

function isConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

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

/** All published events, newest first (the Events page splits upcoming/past). */
export const getPublishedEvents = () =>
  fetchRows<EventRow>("events", [published], { column: "event_date", ascending: false });

export const getImpactHighlights = () =>
  fetchRows<ImpactHighlightRow>("impact_highlights", [published], { column: "display_order" });

export const getImpactStatsForPage = (page: string) =>
  fetchRows<ImpactStatRow>("impact_stats", [published, { column: "page", value: page }], {
    column: "display_order",
  });
