import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { NFT_AWARD_TIERS } from "@/lib/nft-utils";

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to ensure valid UUID
function ensureValidUUID(id: string): string {
  if (isValidUUID(id)) {
    return id;
  }
  // For non-UUID strings, generate a deterministic UUID using the string
  const encoder = new TextEncoder();
  const data = encoder.encode(id);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, "0")}`;
}

interface NFTAwardRecord {
  nft_award_id: string;
  token_id: string;
  contract_address: string;
  awarded_at: string;
  points_at_award: number;
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = ensureValidUUID(params.id);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const serviceClient = getServiceSupabase();

    // Get user's NFT awards
    const { data, error } = await serviceClient
      .from("user_nft_awards")
      .select("*")
      .eq("user_id", userId)
      .order("awarded_at", { ascending: false });

    if (error) {
      console.error("Error fetching user NFT awards:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch NFT awards" },
        { status: 500 },
      );
    }

    // Format the awards
    const awards = (data as NFTAwardRecord[]).map((item) => {
      const awardDetails = NFT_AWARD_TIERS.find(
        (award) => award.id === item.nft_award_id,
      );

      return {
        id: item.nft_award_id,
        name: awardDetails?.name || "Unknown Award",
        description: awardDetails?.description || "",
        imageUrl: awardDetails?.imageUrl || "",
        pointThreshold: awardDetails?.pointThreshold || 0,
        tokenId: item.token_id,
        contractAddress: item.contract_address,
        awardedAt: item.awarded_at,
        pointsAtAward: item.points_at_award,
        blockchainExplorerUrl: item.contract_address
          ? `https://etherscan.io/token/${item.contract_address}?a=${item.token_id}`
          : undefined,
      };
    });

    // Get user's current points
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("participation_count")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      // Continue without user points
    }

    // Get next available award
    const currentPoints = user?.participation_count || 0;
    const earnedThresholds = (data as NFTAwardRecord[]).map((item) => {
      const award = NFT_AWARD_TIERS.find((a) => a.id === item.nft_award_id);
      return award?.pointThreshold || 0;
    });

    const nextAward = NFT_AWARD_TIERS.filter(
      (award) => !earnedThresholds.includes(award.pointThreshold),
    )
      .sort((a, b) => a.pointThreshold - b.pointThreshold)
      .find((award) => award.pointThreshold > currentPoints);

    return NextResponse.json({
      success: true,
      awards,
      currentPoints,
      nextAward: nextAward
        ? {
            ...nextAward,
            pointsNeeded: nextAward.pointThreshold - currentPoints,
          }
        : null,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
