import { createClient } from "@/lib/supabase-client"

export interface DonationStats {
  total_donations: number
  total_amount: number
  recurring_donors: number
  average_donation: number
}

export interface Donation {
  id: number
  amount: number
  donor_email?: string
  donor_name?: string
  payment_processor: string
  payment_id: string
  subscription_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  subscription_id: string
  donor_id?: string
  donor_email?: string
  amount: number
  interval: string
  status: string
  created_at: string
  updated_at: string
}

/**
 * Get donation statistics for a given date range
 */
export async function getDonationStatistics(startDate?: Date, endDate?: Date): Promise<DonationStats | null> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_donation_statistics", {
    start_date: startDate?.toISOString(),
    end_date: endDate?.toISOString(),
  })

  if (error) {
    console.error("Error fetching donation statistics:", error)
    return null
  }

  return data
}

/**
 * Get recent donations
 */
export async function getRecentDonations(limit = 10): Promise<Donation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent donations:", error)
    return []
  }

  return data || []
}

/**
 * Get active subscriptions
 */
export async function getActiveSubscriptions(): Promise<Subscription[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching active subscriptions:", error)
    return []
  }

  return data || []
}

/**
 * Record a donation in the database
 */
export async function recordDonation(donation: Omit<Donation, "id" | "created_at" | "updated_at">): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("donations").insert({
    ...donation,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error recording donation:", error)
    return false
  }

  return true
}

/**
 * Update donation status
 */
export async function updateDonationStatus(paymentId: string, status: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("donations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("payment_id", paymentId)

  if (error) {
    console.error("Error updating donation status:", error)
    return false
  }

  return true
}
