"use server"

import { supabaseAdmin } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"

/**
 * Approve a volunteer recruiter account
 */
export async function approveVolunteerRecruiter(userId: string) {
  try {
    // Update the volunteer.recruiters table to set is_active to true
    const { error } = await supabaseAdmin
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

    // Revalidate relevant paths
    revalidatePath("/admin/volunteers")

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
    // Delete the volunteer.recruiters record
    const { error: deleteError } = await supabaseAdmin.from("volunteer.recruiters").delete().eq("id", userId)

    if (deleteError) {
      console.error("Error deleting volunteer recruiter:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Update user_type to 'rejected'
    const { error: updateError } = await supabaseAdmin
      .from("user_types")
      .update({ user_type: "rejected" })
      .eq("user_id", userId)

    if (updateError) {
      console.error("Error updating user type:", updateError)
      return { success: false, error: updateError.message }
    }

    // Revalidate relevant paths
    revalidatePath("/admin/volunteers")

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
    const { data, error } = await supabaseAdmin
      .from("volunteer.recruiters")
      .select("*, user_types!inner(user_type)")
      .eq("is_active", false)
      .eq("user_types.user_type", "volunteer")

    if (error) {
      console.error("Error fetching pending volunteers:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching pending volunteers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: [],
    }
  }
}
