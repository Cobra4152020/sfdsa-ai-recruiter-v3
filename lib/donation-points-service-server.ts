import { checkAndAwardNFTs } from "@/lib/nft-utils-server";
import { awardBadgeToUser } from "@/lib/badge-utils";
import { getServiceSupabase } from "@/app/lib/supabase/server";

const supabase = getServiceSupabase();

export interface DonationPointRule {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  pointsPerDollar: number;
  recurringMultiplier: number;
  isActive: boolean;
  campaignId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  pointMultiplier: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPointsAward {
  userId: string;
  donationId: string;
  points: number;
  isRecurring: boolean;
  amount: number;
}

// Row type for donation_point_rules from Supabase
interface DonationPointRuleRow {
  id: number;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number | null;
  points_per_dollar: number;
  recurring_multiplier: number;
  is_active: boolean;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
}

// Row type for donation_campaigns from Supabase
interface DonationCampaignRow {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  point_multiplier: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function awardDonationPoints(
  userId: string,
  donationId: string,
  amount: number,
  isRecurring = false,
): Promise<{ success: boolean; points?: number; message?: string }> {
  try {
    const { data, error } = await supabase.rpc("calculate_donation_points", {
      p_donation_id: donationId,
      p_user_id: userId,
      p_amount: amount,
      p_is_recurring: isRecurring,
    });

    if (error) {
      console.error("Error awarding donation points:", error);
      return { success: false, message: error.message };
    }

    const pointsAwarded = data as number;

    await checkDonationBadges(userId, amount, isRecurring);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("donation_points, participation_count")
      .eq("id", userId)
      .single();

    if (!userError && userData) {
      const totalPoints =
        (userData.participation_count || 0) + (userData.donation_points || 0);
      await checkAndAwardNFTs(userId, totalPoints);
    }

    return { success: true, points: pointsAwarded };
  } catch (error) {
    console.error("Exception in awardDonationPoints:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkDonationBadges(
  userId: string,
  amount: number,
  isRecurring: boolean,
) {
  try {
    const { data: donationHistory, error } = await supabase
      .from("donation_points")
      .select("donation_id, points, is_recurring")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching donation history:", error);
      return;
    }

    if (donationHistory.length === 1) {
      await awardBadgeToUser(userId, "first-donation");
    }
    if (isRecurring) {
      await awardBadgeToUser(userId, "recurring-donor");
    }
    if (amount >= 100) {
      await awardBadgeToUser(userId, "generous-donor");
    }
    const totalDonations = donationHistory.length;
    if (totalDonations >= 5) {
      await awardBadgeToUser(userId, "donation-milestone-5");
    }
    if (totalDonations >= 10) {
      await awardBadgeToUser(userId, "donation-milestone-10");
    }
    if (totalDonations >= 25) {
      await awardBadgeToUser(userId, "donation-milestone-25");
    }
    const { data: totalData, error: totalError } = await supabase
      .from("donations")
      .select("amount")
      .eq("donor_id", userId)
      .eq("status", "completed");
    if (!totalError && totalData) {
      const totalAmount = totalData.reduce(
        (sum: number, donation: { amount: number }) =>
          sum + (donation.amount || 0),
        0,
      );
      if (totalAmount >= 250) {
        await awardBadgeToUser(userId, "donation-amount-250");
      }
      if (totalAmount >= 500) {
        await awardBadgeToUser(userId, "donation-amount-500");
      }
      if (totalAmount >= 1000) {
        await awardBadgeToUser(userId, "donation-amount-1000");
      }
    }
  } catch (error) {
    console.error("Error checking donation badges:", error);
  }
}

export async function getDonationPointRules(): Promise<{
  success: boolean;
  rules?: DonationPointRule[];
  message?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("donation_point_rules")
      .select("*")
      .order("min_amount", { ascending: true });
    if (error) {
      console.error("Error fetching donation point rules:", error);
      return { success: false, message: error.message };
    }
    const rules = data.map(
      (rule: DonationPointRuleRow): DonationPointRule => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        minAmount: rule.min_amount,
        maxAmount: rule.max_amount,
        pointsPerDollar: rule.points_per_dollar,
        recurringMultiplier: rule.recurring_multiplier,
        isActive: rule.is_active,
        campaignId: rule.campaign_id,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
      }),
    );
    return { success: true, rules };
  } catch (error) {
    console.error("Exception in getDonationPointRules:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateDonationPointRule(
  ruleId: number,
  rule: Partial<DonationPointRule>,
): Promise<{ success: boolean; message?: string }> {
  try {
    const { error } = await supabase
      .from("donation_point_rules")
      .update({
        name: rule.name,
        description: rule.description,
        min_amount: rule.minAmount,
        max_amount: rule.maxAmount,
        points_per_dollar: rule.pointsPerDollar,
        recurring_multiplier: rule.recurringMultiplier,
        is_active: rule.isActive,
        campaign_id: rule.campaignId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ruleId);
    if (error) {
      console.error("Error updating donation point rule:", error);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Exception in updateDonationPointRule:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getActiveDonationCampaigns(): Promise<{
  success: boolean;
  campaigns?: DonationCampaign[];
  message?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("donation_campaigns")
      .select("*")
      .eq("is_active", true)
      .gte("start_date", new Date().toISOString())
      .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
      .order("start_date", { ascending: false });
    if (error) {
      console.error("Error fetching active donation campaigns:", error);
      return { success: false, message: error.message };
    }
    const campaigns = data.map(
      (campaign: DonationCampaignRow): DonationCampaign => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        pointMultiplier: campaign.point_multiplier,
        isActive: campaign.is_active,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
      }),
    );
    return { success: true, campaigns };
  } catch (error) {
    console.error("Exception in getActiveDonationCampaigns:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserDonationPoints(userId: string): Promise<{
  success: boolean;
  points?: number;
  donationCount?: number;
  message?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("donation_points")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error fetching user donation points:", error);
      return { success: false, message: error.message };
    }
    const { count, error: countError } = await supabase
      .from("donation_points")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) {
      console.error("Error fetching donation count:", countError);
    }
    return {
      success: true,
      points: data.donation_points || 0,
      donationCount: count || 0,
    };
  } catch (error) {
    console.error("Exception in getUserDonationPoints:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDonationLeaderboard(
  limit = 10,
  offset = 0,
): Promise<{
  success: boolean;
  leaderboard?: unknown[];
  total?: number;
  message?: string;
}> {
  try {
    const { data, error, count } = await supabase
      .from("donation_leaderboard")
      .select("*", { count: "exact" })
      .order("donation_points", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      console.error("Error fetching donation leaderboard:", error);
      return { success: false, message: error.message };
    }
    return {
      success: true,
      leaderboard: data,
      total: count || 0,
    };
  } catch (error) {
    console.error("Exception in getDonationLeaderboard:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
