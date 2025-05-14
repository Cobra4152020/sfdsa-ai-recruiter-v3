import { supabaseAdmin } from "./supabase-service"

export type UserRole = "recruit" | "volunteer" | "admin"
export type UserStatus = "active" | "pending" | "rejected" | "inactive"

export interface UserBasic {
  id: string
  email: string
  created_at: string
  user_type?: UserRole
  status?: UserStatus
}

export interface RecruitUser extends UserBasic {
  first_name?: string
  last_name?: string
  phone?: string
  zip_code?: string
  avatar_url?: string
  points?: number
  badge_count?: number
  participation_count?: number
}

export interface VolunteerUser extends UserBasic {
  first_name?: string
  last_name?: string
  phone?: string
  organization?: string
  is_verified?: boolean
  is_active?: boolean
  verified_at?: string
  referral_count?: number
  points?: number
}

export interface AdminUser extends UserBasic {
  name?: string
  last_login?: string
}

export type UserWithRole = RecruitUser | VolunteerUser | AdminUser

export interface UserStats {
  total_users: number
  active_users: number
  recruits: number
  volunteers: number
  admins: number
  pending_volunteers: number
  recent_signups: number
}

/**
 * Verify if a user is an admin
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).single()

    if (error) {
      console.error("Error verifying admin access:", error)
      return false
    }

    return data?.role === "admin"
  } catch (error) {
    console.error("Error verifying admin access:", error)
    return false
  }
}

/**
 * Get all users with their roles
 */
export async function getAllUsers(
  options: {
    page?: number
    limit?: number
    search?: string
    role?: UserRole
    status?: UserStatus
    sortBy?: string
    sortOrder?: "asc" | "desc"
  } = {},
): Promise<{ users: UserWithRole[]; total: number }> {
  const { page = 1, limit = 20, search = "", role, status, sortBy = "created_at", sortOrder = "desc" } = options

  const offset = (page - 1) * limit

  try {
    // First get user types to know which tables to query
    const { data: userTypes, error: userTypesError } = await supabaseAdmin
      .from("user_types")
      .select("user_id, user_type")
      .order("user_id", { ascending: true })
      .ilike("user_type", role ? role : "%")

    if (userTypesError) throw userTypesError

    if (!userTypes || userTypes.length === 0) {
      return { users: [], total: 0 }
    }

    // Group users by type
    const usersByType: Record<UserRole, string[]> = {
      recruit: [],
      volunteer: [],
      admin: [],
    }

    userTypes.forEach((user) => {
      if (user.user_type in usersByType) {
        usersByType[user.user_type as UserRole].push(user.user_id)
      }
    })

    // Get users from each table based on their type
    const [recruitsData, volunteersData, adminsData, totalCount] = await Promise.all([
      // Get recruits
      usersByType.recruit.length > 0
        ? supabaseAdmin
            .from("recruit.users")
            .select("*")
            .in("id", usersByType.recruit)
            .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
            .order(sortBy, { ascending: sortOrder === "asc" })
            .range(offset, offset + limit - 1)
        : Promise.resolve({ data: [], error: null }),

      // Get volunteers
      usersByType.volunteer.length > 0
        ? supabaseAdmin
            .from("volunteer.recruiters")
            .select("*")
            .in("id", usersByType.volunteer)
            .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
            .eq(status ? "is_active" : "id", status === "active" ? true : status === "pending" ? false : "id")
            .order(sortBy, { ascending: sortOrder === "asc" })
            .range(offset, offset + limit - 1)
        : Promise.resolve({ data: [], error: null }),

      // Get admins
      usersByType.admin.length > 0
        ? supabaseAdmin
            .from("admin.users")
            .select("*")
            .in("id", usersByType.admin)
            .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
            .order(sortBy, { ascending: sortOrder === "asc" })
            .range(offset, offset + limit - 1)
        : Promise.resolve({ data: [], error: null }),

      // Get total count
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" })
        .ilike("user_type", role ? role : "%"),
    ])

    if (recruitsData.error) throw recruitsData.error
    if (volunteersData.error) throw volunteersData.error
    if (adminsData.error) throw adminsData.error

    // Combine users with their roles
    const users: UserWithRole[] = []

    // Add recruits
    if (recruitsData.data) {
      recruitsData.data.forEach((recruit) => {
        users.push({
          ...recruit,
          user_type: "recruit",
          status: "active", // Default status for recruits
        })
      })
    }

    // Add volunteers
    if (volunteersData.data) {
      volunteersData.data.forEach((volunteer) => {
        users.push({
          ...volunteer,
          user_type: "volunteer",
          status: volunteer.is_active ? "active" : "pending",
        })
      })
    }

    // Add admins
    if (adminsData.data) {
      adminsData.data.forEach((admin) => {
        users.push({
          ...admin,
          user_type: "admin",
          status: "active", // Default status for admins
        })
      })
    }

    return {
      users,
      total: totalCount.count || 0,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStats> {
  try {
    const [
      totalUsersResult,
      recruitsResult,
      volunteersResult,
      adminsResult,
      pendingVolunteersResult,
      recentSignupsResult,
    ] = await Promise.all([
      // Total users
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" }),

      // Recruits
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" })
        .eq("user_type", "recruit"),

      // Volunteers
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" })
        .eq("user_type", "volunteer"),

      // Admins
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" })
        .eq("user_type", "admin"),

      // Pending volunteers
      supabaseAdmin
        .from("volunteer.recruiters")
        .select("id", { count: "exact" })
        .eq("is_active", false)
        .eq("is_verified", false),

      // Recent signups (last 7 days)
      supabaseAdmin
        .from("user_types")
        .select("user_id", { count: "exact" })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    // Active users (users who have logged in within the last 30 days)
    const { data: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from("auth.users")
      .select("id", { count: "exact" })
      .gte("last_sign_in_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (activeUsersError) throw activeUsersError

    return {
      total_users: totalUsersResult.count || 0,
      active_users: activeUsers?.length || 0,
      recruits: recruitsResult.count || 0,
      volunteers: volunteersResult.count || 0,
      admins: adminsResult.count || 0,
      pending_volunteers: pendingVolunteersResult.count || 0,
      recent_signups: recentSignupsResult.count || 0,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw error
  }
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string): Promise<UserWithRole | null> {
  try {
    // First get the user type
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) {
      if (userTypeError.code === "PGRST116") {
        // User not found
        return null
      }
      throw userTypeError
    }

    if (!userType) return null

    // Get the user from the appropriate table
    let userData: any = null
    let userError: any = null

    switch (userType.user_type) {
      case "recruit":
        ;({ data: userData, error: userError } = await supabaseAdmin
          .from("recruit.users")
          .select("*")
          .eq("id", id)
          .single())
        break
      case "volunteer":
        ;({ data: userData, error: userError } = await supabaseAdmin
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", id)
          .single())
        break
      case "admin":
        ;({ data: userData, error: userError } = await supabaseAdmin
          .from("admin.users")
          .select("*")
          .eq("id", id)
          .single())
        break
      default:
        return null
    }

    if (userError) throw userError
    if (!userData) return null

    return {
      ...userData,
      user_type: userType.user_type,
      status: userType.user_type === "volunteer" ? (userData.is_active ? "active" : "pending") : "active",
    }
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    throw error
  }
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  data: Partial<UserWithRole>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the user type
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) throw userTypeError
    if (!userType) return { success: false, error: "User not found" }

    // Remove fields that shouldn't be updated
    const { user_type, status, created_at, ...updateData } = data

    // Update the user in the appropriate table
    let updateError: any = null

    switch (userType.user_type) {
      case "recruit":
        ;({ error: updateError } = await supabaseAdmin.from("recruit.users").update(updateData).eq("id", id))
        break
      case "volunteer":
        // Handle status change for volunteers
        if (status && status !== "active" && status !== "pending") {
          return { success: false, error: "Invalid status for volunteer" }
        }

        // Convert status to is_active
        const volunteerData = {
          ...updateData,
          is_active: status === "active",
        }
        ;({ error: updateError } = await supabaseAdmin.from("volunteer.recruiters").update(volunteerData).eq("id", id))
        break
      case "admin":
        ;({ error: updateError } = await supabaseAdmin.from("admin.users").update(updateData).eq("id", id))
        break
      default:
        return { success: false, error: "Invalid user type" }
    }

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error(`Error updating user ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the user type
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) throw userTypeError
    if (!userType) return { success: false, error: "User not found" }

    // Delete the user from the appropriate table
    let deleteError: any = null

    switch (userType.user_type) {
      case "recruit":
        ;({ error: deleteError } = await supabaseAdmin.from("recruit.users").delete().eq("id", id))
        break
      case "volunteer":
        ;({ error: deleteError } = await supabaseAdmin.from("volunteer.recruiters").delete().eq("id", id))
        break
      case "admin":
        ;({ error: deleteError } = await supabaseAdmin.from("admin.users").delete().eq("id", id))
        break
      default:
        return { success: false, error: "Invalid user type" }
    }

    if (deleteError) throw deleteError

    // Delete the user type
    const { error: userTypeDeleteError } = await supabaseAdmin.from("user_types").delete().eq("user_id", id)

    if (userTypeDeleteError) throw userTypeDeleteError

    // Delete the auth user
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authDeleteError) throw authDeleteError

    return { success: true }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Change a user's role
 */
export async function changeUserRole(id: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the current user type
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) throw userTypeError
    if (!userType) return { success: false, error: "User not found" }

    // If the role is the same, do nothing
    if (userType.user_type === newRole) {
      return { success: true }
    }

    // Get the user data
    const user = await getUserById(id)
    if (!user) return { success: false, error: "User not found" }

    // Start a transaction
    const { error: txError } = await supabaseAdmin.rpc("begin_transaction")
    if (txError) throw txError

    try {
      // Create a new record in the appropriate table
      let insertError: any = null
      const { id: userId, user_type, status, ...userData } = user

      switch (newRole) {
        case "recruit":
          ;({ error: insertError } = await supabaseAdmin.from("recruit.users").insert({
            id: userId,
            ...userData,
          }))
          break
        case "volunteer":
          ;({ error: insertError } = await supabaseAdmin.from("volunteer.recruiters").insert({
            id: userId,
            ...userData,
            is_active: true,
            is_verified: true,
            verified_at: new Date().toISOString(),
          }))
          break
        case "admin":
          ;({ error: insertError } = await supabaseAdmin.from("admin.users").insert({
            id: userId,
            ...userData,
          }))
          break
        default:
          await supabaseAdmin.rpc("rollback_transaction")
          return { success: false, error: "Invalid role" }
      }

      if (insertError) throw insertError

      // Delete the user from the old table
      let deleteError: any = null

      switch (userType.user_type) {
        case "recruit":
          ;({ error: deleteError } = await supabaseAdmin.from("recruit.users").delete().eq("id", userId))
          break
        case "volunteer":
          ;({ error: deleteError } = await supabaseAdmin.from("volunteer.recruiters").delete().eq("id", userId))
          break
        case "admin":
          ;({ error: deleteError } = await supabaseAdmin.from("admin.users").delete().eq("id", userId))
          break
      }

      if (deleteError) throw deleteError

      // Update the user type
      const { error: updateError } = await supabaseAdmin
        .from("user_types")
        .update({ user_type: newRole })
        .eq("user_id", userId)

      if (updateError) throw updateError

      // Commit the transaction
      const { error: commitError } = await supabaseAdmin.rpc("commit_transaction")
      if (commitError) throw commitError

      return { success: true }
    } catch (error) {
      // Rollback the transaction
      await supabaseAdmin.rpc("rollback_transaction")
      throw error
    }
  } catch (error) {
    console.error(`Error changing role for user ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Approve a volunteer recruiter
 */
export async function approveVolunteerRecruiter(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the user is a volunteer
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) throw userTypeError
    if (!userType || userType.user_type !== "volunteer") {
      return { success: false, error: "User is not a volunteer" }
    }

    // Update the volunteer
    const { error: updateError } = await supabaseAdmin
      .from("volunteer.recruiters")
      .update({
        is_active: true,
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error(`Error approving volunteer ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Reject a volunteer recruiter
 */
export async function rejectVolunteerRecruiter(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the user is a volunteer
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single()

    if (userTypeError) throw userTypeError
    if (!userType || userType.user_type !== "volunteer") {
      return { success: false, error: "User is not a volunteer" }
    }

    // Update the volunteer
    const { error: updateError } = await supabaseAdmin
      .from("volunteer.recruiters")
      .update({
        is_active: false,
        is_verified: false,
      })
      .eq("id", id)

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error(`Error rejecting volunteer ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Get pending volunteer recruiters
 */
export async function getPendingVolunteerRecruiters(): Promise<VolunteerUser[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("volunteer.recruiters")
      .select("*")
      .eq("is_active", false)
      .eq("is_verified", false)

    if (error) throw error

    return data.map((volunteer) => ({
      ...volunteer,
      user_type: "volunteer",
      status: "pending",
    }))
  } catch (error) {
    console.error("Error fetching pending volunteers:", error)
    throw error
  }
}

/**
 * Get user activity
 */
export async function getUserActivity(
  userId: string,
  options: {
    limit?: number
    page?: number
  } = {},
): Promise<{ activities: any[]; total: number }> {
  const { limit = 20, page = 1 } = options
  const offset = (page - 1) * limit

  try {
    // Get user activities
    const { data, error, count } = await supabaseAdmin
      .from("user_activities")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      activities: data || [],
      total: count || 0,
    }
  } catch (error) {
    console.error(`Error fetching activities for user ${userId}:`, error)
    throw error
  }
}
