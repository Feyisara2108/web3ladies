import { PartnerView } from "@/components/site/partner-view";
import { getImpactHighlights, getImpactStatsForPage, getPartnersByCategory } from "@/lib/queries";

export default async function PartnerPage() {
  const [highlights, pastPartners, stats] = await Promise.all([
    getImpactHighlights(),
    getPartnersByCategory("past"),
    getImpactStatsForPage("partner"),
  ]);
  return <PartnerView highlights={highlights} pastPartners={pastPartners} stats={stats} />;
}
