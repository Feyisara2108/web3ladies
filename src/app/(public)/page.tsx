import { HomeView } from "@/components/site/home-view";
import {
  getHomeFeatured,
  getPartnersByCategory,
  getPublishedFounderStory,
  getSocialProofItems,
} from "@/lib/queries";

export default async function HomePage() {
  const [featured, partners, socialProof, founder] = await Promise.all([
    getHomeFeatured(),
    getPartnersByCategory("supporter"),
    getSocialProofItems(),
    getPublishedFounderStory(),
  ]);

  return (
    <HomeView
      featured={featured}
      partners={partners}
      socialProof={socialProof}
      founder={founder}
    />
  );
}
