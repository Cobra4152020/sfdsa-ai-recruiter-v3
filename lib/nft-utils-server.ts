import { getServiceSupabase } from "@/app/lib/supabase/server";
import { NFT_AWARD_TIERS, NFTAward, ensureValidUUID } from "./nft-utils";

interface UserNftAwardRow {
  nft_award_id: string;
  token_id: string;
  contract_address: string;
  awarded_at: string;
  points_at_award: number;
}

interface UserNftAwardIdRow {
  nft_award_id: string;
}

/**
 * Check if a user has earned any new NFT awards based on their points
 */
export async function checkAndAwardNFTs(userId: string, currentPoints: number) {
  try {
    const validUserId = ensureValidUUID(userId);

    // Get user's existing NFT awards
    const serviceClient = getServiceSupabase();
    const { data: existingAwards, error: fetchError } = await serviceClient
      .from("user_nft_awards")
      .select("nft_award_id")
      .eq("user_id", validUserId);

    if (fetchError) {
      console.error("Error fetching existing NFT awards:", fetchError);
      return { success: false, message: "Failed to fetch existing NFT awards" };
    }

    const existingAwardIds =
      existingAwards?.map((award: UserNftAwardIdRow) => award.nft_award_id) ||
      [];

    // Find eligible awards that haven't been awarded yet
    const eligibleAwards = NFT_AWARD_TIERS.filter(
      (award) =>
        award.pointThreshold <= currentPoints &&
        !existingAwardIds.includes(award.id),
    );

    if (eligibleAwards.length === 0) {
      return { success: true, newAwards: [] };
    }

    // Award new NFTs
    const newAwards: NFTAward[] = [];

    for (const award of eligibleAwards) {
      try {
        // In a real implementation, this would mint the NFT on the blockchain
        // For now, we'll just record it in the database
        const { data, error } = await serviceClient
          .from("user_nft_awards")
          .insert([
            {
              user_id: validUserId,
              nft_award_id: award.id,
              awarded_at: new Date().toISOString(),
              points_at_award: currentPoints,
              // In a real implementation, these would come from the blockchain
              token_id: `mock-token-${Math.floor(Math.random() * 1000000)}`,
              contract_address: "0x1234567890123456789012345678901234567890",
            },
          ])
          .select();

        if (error) {
          console.error(`Error awarding NFT ${award.id}:`, error);
          continue;
        }

        newAwards.push({
          ...award,
          tokenId: data[0].token_id,
          contractAddress: data[0].contract_address,
          blockchainExplorerUrl: `https://etherscan.io/token/${data[0].contract_address}?a=${data[0].token_id}`,
        });

        // Send notification about the new NFT award
        await fetch("/api/send-nft-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: validUserId,
            nftAwardId: award.id,
          }),
        });
      } catch (awardError) {
        console.error(`Error processing NFT award ${award.id}:`, awardError);
      }
    }

    return { success: true, newAwards };
  } catch (error) {
    console.error("Error checking and awarding NFTs:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all NFT awards for a user
 */
export async function getUserNFTAwards(userId: string) {
  try {
    const validUserId = ensureValidUUID(userId);
    const serviceClient = getServiceSupabase();
    const { data, error } = await serviceClient
      .from("user_nft_awards")
      .select("*, nft_award:nft_award_id(*)")
      .eq("user_id", validUserId)
      .order("awarded_at", { ascending: false });

    if (error) {
      console.error("Error fetching user NFT awards:", error);
      return { success: false, message: "Failed to fetch NFT awards" };
    }

    // Format the awards
    const awards = data.map((item: UserNftAwardRow) => ({
      id: item.nft_award_id,
      name:
        NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)?.name ||
        "Unknown Award",
      description:
        NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)
          ?.description || "",
      imageUrl:
        NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)
          ?.imageUrl || "",
      pointThreshold:
        NFT_AWARD_TIERS.find((tier) => tier.id === item.nft_award_id)
          ?.pointThreshold || 0,
      tokenId: item.token_id,
      contractAddress: item.contract_address,
      awardedAt: item.awarded_at,
      pointsAtAward: item.points_at_award,
      blockchainExplorerUrl: item.contract_address
        ? `https://etherscan.io/token/${item.contract_address}?a=${item.token_id}`
        : undefined,
    }));

    return { success: true, awards };
  } catch (error) {
    console.error("Error getting user NFT awards:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
