"use client"

import { createClient } from "@/lib/supabase-server"
import { useRouter } from "next/navigation"

interface Recruiter {
  id: string
  is_active: boolean
  is_verified: boolean
  verified_at: string | null
  [key: string]: any
}

interface UserType {
  user_id: string
  user_type: string
}

/**
 * Approve a volunteer recruiter account
 */
export async function approveVolunteerRecruiter(userId: string) {
  try {
    const supabase = createClient()

    // Update the volunteer.recruiters table to set is_active to true
    const { error } = await supabase
      .from("volunteer.recruiters")
      .update({
        is_active: true,
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error approving volunteer recruiter:", error)
      return { success: false, error: error.message }
    }

    // Update user_type separately since there's no foreign key relationship
    const { error: userTypeError } = await supabase
      .from("user_types")
      .update({ user_type: "volunteer_active" })
      .eq("user_id", userId)

    if (userTypeError) {
      console.error("Error updating user type:", userTypeError)
      // Continue anyway since the main update succeeded
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error approving volunteer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Reject a volunteer recruiter account
 */
export async function rejectVolunteerRecruiter(userId: string) {
  try {
    const supabase = createClient()

    // Delete the volunteer.recruiters record
    const { error: deleteError } = await supabase.from("volunteer.recruiters").delete().eq("id", userId)

    if (deleteError) {
      console.error("Error deleting volunteer recruiter:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Update user_type to 'rejected'
    const { error: updateError } = await supabase
      .from("user_types")
      .update({ user_type: "rejected" })
      .eq("user_id", userId)

    if (updateError) {
      console.error("Error updating user type:", updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error rejecting volunteer:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Get pending volunteer recruiters
 */
export async function getPendingVolunteerRecruiters() {
  try {
    const supabase = createClient()

    // Modified query to avoid the foreign key relationship error
    const { data: recruiters, error: recruitersError } = await supabase
      .from("volunteer.recruiters")
      .select("*")
      .eq("is_active", false)

    if (recruitersError) {
      console.error("Error fetching pending volunteers:", recruitersError)
      return { success: false, error: recruitersError.message, data: [] }
    }

    // Get user types separately
    if (recruiters && recruiters.length > 0) {
      const userIds = recruiters.map((recruiter: Recruiter) => recruiter.id)

      const { data: userTypes, error: userTypesError } = await supabase
        .from("user_types")
        .select("*")
        .in("user_id", userIds)
        .eq("user_type", "volunteer")

      if (userTypesError) {
        console.error("Error fetching user types:", userTypesError)
        // Continue anyway with just the recruiters data
      }

      // Combine the data
      const combinedData = recruiters.map((recruiter: Recruiter) => {
        const userType = userTypes?.find((ut: UserType) => ut.user_id === recruiter.id)
        return {
          ...recruiter,
          user_types: userType ? { user_type: userType.user_type } : { user_type: "unknown" },
        }
      })

      return { success: true, data: combinedData }
    }

    return { success: true, data: recruiters || [] }
  } catch (error) {
    console.error("Unexpected error fetching pending volunteers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: [],
    }
  }
}
