import { EventsView } from "@/components/site/events-view";
import { getPublishedEvents } from "@/lib/queries";

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const [events, { event }] = await Promise.all([getPublishedEvents(), searchParams]);
  return <EventsView events={events} eventId={typeof event === "string" ? event : undefined} />;
}
