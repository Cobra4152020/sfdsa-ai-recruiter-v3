import { NFT_AWARD_TIERS } from "@/lib/nft-utils";
import { NFTAwardPageClient } from "./client";

// Generate static paths for all NFT awards
export async function generateStaticParams() {
  return NFT_AWARD_TIERS.map((award) => ({
    id: award.id,
  }));
}

export default async function NFTAwardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const award = NFT_AWARD_TIERS.find((award) => award.id === id);
  return <NFTAwardPageClient award={award} />;
}
