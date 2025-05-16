"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

/**
 * Approve a volunteer recruiter account
 */
export async function approveVolunteerRecruiter(userId: string) {
  try {
    const supabaseAdmin = createServerClient()

    // Update the volunteer.recruiters table to set is_active to true
    // Fixed: removed "public." prefix from the table name
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

    // Update user_type separately since there's no foreign key relationship
    const { error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .update({ user_type: "volunteer_active" })
      .eq("user_id", userId)

    if (userTypeError) {
      console.error("Error updating user type:", userTypeError)
      // Continue anyway since the main update succeeded
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
    const supabaseAdmin = createServerClient()

    // Delete the volunteer.recruiters record
    // Fixed: removed "public." prefix from the table name
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
    const supabaseAdmin = createServerClient()

    // Modified query to avoid the foreign key relationship error
    // Fixed: removed "public." prefix from the table name
    const { data: recruiters, error: recruitersError } = await supabaseAdmin
      .from("volunteer.recruiters")
      .select("*")
      .eq("is_active", false)

    if (recruitersError) {
      console.error("Error fetching pending volunteers:", recruitersError)
      return { success: false, error: recruitersError.message, data: [] }
    }

    // Get user types separately
    if (recruiters && recruiters.length > 0) {
      const userIds = recruiters.map((recruiter) => recruiter.id)

      const { data: userTypes, error: userTypesError } = await supabaseAdmin
        .from("user_types")
        .select("*")
        .in("user_id", userIds)
        .eq("user_type", "volunteer")

      if (userTypesError) {
        console.error("Error fetching user types:", userTypesError)
        // Continue anyway with just the recruiters data
      }

      // Combine the data
      const combinedData = recruiters.map((recruiter) => {
        const userType = userTypes?.find((ut) => ut.user_id === recruiter.id)
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
