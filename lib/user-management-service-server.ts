import { getServiceSupabase } from "@/app/lib/supabase/server";
import type {
  UserRole,
  UserStatus,
  UserBasic,
  RecruitUser,
  VolunteerUser,
  AdminUser,
  UserWithRole,
  UserStats,
} from "./user-management-service";

// Move all functions that use getServiceSupabase or require server-only logic here.

export async function verifyAdminAccess(userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Error verifying admin access:", error);
      return false;
    }
    return data?.role === "admin";
  } catch (error) {
    console.error("Error verifying admin access:", error);
    return false;
  }
}

export async function getAllUsers(
  options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {},
): Promise<{ users: UserWithRole[]; total: number }> {
  const {
    page = 1,
    limit = 20,
    search = "",
    role,
    status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;
  const offset = (page - 1) * limit;
  const supabaseAdmin = getServiceSupabase();
  try {
    const { data: userTypes, error: userTypesError } = await supabaseAdmin
      .from("user_types")
      .select("user_id, user_type")
      .order("user_id", { ascending: true })
      .ilike("user_type", role ? role : "%");
    if (userTypesError) throw userTypesError;
    if (!userTypes || userTypes.length === 0) {
      return { users: [], total: 0 };
    }
    const usersByType: Record<UserRole, string[]> = {
      recruit: [],
      volunteer: [],
      admin: [],
    };
    userTypes.forEach((user: { user_id: string; user_type: UserRole }) => {
      if (user.user_type in usersByType) {
        usersByType[user.user_type as UserRole].push(user.user_id);
      }
    });
    const [recruitsData, volunteersData, adminsData, totalCount] =
      await Promise.all([
        usersByType.recruit.length > 0
          ? supabaseAdmin
              .from("recruit.users")
              .select("*")
              .in("id", usersByType.recruit)
              .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
              .order(sortBy, { ascending: sortOrder === "asc" })
              .range(offset, offset + limit - 1)
          : Promise.resolve({ data: [], error: null }),
        usersByType.volunteer.length > 0
          ? supabaseAdmin
              .from("volunteer.recruiters")
              .select("*")
              .in("id", usersByType.volunteer)
              .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
              .eq(
                status ? "is_active" : "id",
                status === "active"
                  ? true
                  : status === "pending"
                    ? false
                    : "id",
              )
              .order(sortBy, { ascending: sortOrder === "asc" })
              .range(offset, offset + limit - 1)
          : Promise.resolve({ data: [], error: null }),
        usersByType.admin.length > 0
          ? supabaseAdmin
              .from("admin.users")
              .select("*")
              .in("id", usersByType.admin)
              .ilike(search ? "email" : "id", search ? `%${search}%` : "%")
              .order(sortBy, { ascending: sortOrder === "asc" })
              .range(offset, offset + limit - 1)
          : Promise.resolve({ data: [], error: null }),
        supabaseAdmin
          .from("user_types")
          .select("user_id", { count: "exact" })
          .ilike("user_type", role ? role : "%"),
      ]);
    if (recruitsData.error) throw recruitsData.error;
    if (volunteersData.error) throw volunteersData.error;
    if (adminsData.error) throw adminsData.error;
    const users: UserWithRole[] = [];
    if (recruitsData.data) {
      (recruitsData.data as RecruitUser[]).forEach((recruit: RecruitUser) => {
        users.push({
          ...recruit,
          user_type: "recruit",
          status: "active",
        });
      });
    }
    if (volunteersData.data) {
      (volunteersData.data as VolunteerUser[]).forEach(
        (volunteer: VolunteerUser) => {
          users.push({
            ...volunteer,
            user_type: "volunteer",
            status: volunteer.is_active ? "active" : "pending",
          });
        },
      );
    }
    if (adminsData.data) {
      (adminsData.data as AdminUser[]).forEach((admin: AdminUser) => {
        users.push({
          ...admin,
          user_type: "admin",
          status: "active",
        });
      });
    }
    return {
      users,
      total: totalCount.count || 0,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: recruits },
      { count: volunteers },
      { count: admins },
      { count: pendingVolunteers },
      { count: recentSignups },
    ] = await Promise.all([
      supabaseAdmin.from("user_types").select("*", { count: "exact" }),
      supabaseAdmin
        .from("user_types")
        .select("*", { count: "exact" })
        .eq("status", "active"),
      supabaseAdmin
        .from("user_types")
        .select("*", { count: "exact" })
        .eq("user_type", "recruit"),
      supabaseAdmin
        .from("user_types")
        .select("*", { count: "exact" })
        .eq("user_type", "volunteer"),
      supabaseAdmin
        .from("user_types")
        .select("*", { count: "exact" })
        .eq("user_type", "admin"),
      supabaseAdmin
        .from("volunteer.recruiters")
        .select("*", { count: "exact" })
        .eq("is_active", false),
      supabaseAdmin
        .from("user_types")
        .select("*", { count: "exact" })
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ),
    ]);
    return {
      total_users: totalUsers || 0,
      active_users: activeUsers || 0,
      recruits: recruits || 0,
      volunteers: volunteers || 0,
      admins: admins || 0,
      pending_volunteers: pendingVolunteers || 0,
      recent_signups: recentSignups || 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      total_users: 0,
      active_users: 0,
      recruits: 0,
      volunteers: 0,
      admins: 0,
      pending_volunteers: 0,
      recent_signups: 0,
    };
  }
}

export async function getUserById(id: string): Promise<UserWithRole | null> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single();
    if (userTypeError) throw userTypeError;
    if (!userType) return null;
    let userData: UserWithRole | null = null;
    let error: unknown = null;
    switch (userType.user_type) {
      case "recruit":
        ({ data: userData, error } = await supabaseAdmin
          .from("recruit.users")
          .select("*")
          .eq("id", id)
          .single());
        break;
      case "volunteer":
        ({ data: userData, error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", id)
          .single());
        break;
      case "admin":
        ({ data: userData, error } = await supabaseAdmin
          .from("admin.users")
          .select("*")
          .eq("id", id)
          .single());
        break;
    }
    if (error) throw error;
    if (!userData) return null;
    let status: UserStatus = "pending";
    if (
      userType.user_type === "volunteer" &&
      (userData as VolunteerUser).is_active !== undefined
    ) {
      status = (userData as VolunteerUser).is_active ? "active" : "pending";
    } else {
      status = "active";
    }
    return {
      ...userData,
      user_type: userType.user_type,
      status,
    };
  } catch (error: unknown) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  data: Partial<UserWithRole>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single();
    if (userTypeError) throw userTypeError;
    if (!userType) return { success: false, error: "User not found" };
    let error: unknown = null;
    switch (userType.user_type) {
      case "recruit":
        ({ error } = await supabaseAdmin
          .from("recruit.users")
          .update(data)
          .eq("id", id));
        break;
      case "volunteer":
        ({ error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .update(data)
          .eq("id", id));
        break;
      case "admin":
        ({ error } = await supabaseAdmin
          .from("admin.users")
          .update(data)
          .eq("id", id));
        break;
    }
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single();
    if (userTypeError) throw userTypeError;
    if (!userType) return { success: false, error: "User not found" };
    let error: unknown = null;
    switch (userType.user_type) {
      case "recruit":
        ({ error } = await supabaseAdmin
          .from("recruit.users")
          .delete()
          .eq("id", id));
        break;
      case "volunteer":
        ({ error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .delete()
          .eq("id", id));
        break;
      case "admin":
        ({ error } = await supabaseAdmin
          .from("admin.users")
          .delete()
          .eq("id", id));
        break;
    }
    if (error) throw error;
    ({ error } = await supabaseAdmin
      .from("user_types")
      .delete()
      .eq("user_id", id));
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function changeUserRole(
  id: string,
  newRole: UserRole,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", id)
      .single();
    if (userTypeError) throw userTypeError;
    if (!userType) return { success: false, error: "User not found" };
    if (userType.user_type === newRole) return { success: true };
    let userData: UserWithRole | null = null;
    let error: unknown = null;
    switch (userType.user_type) {
      case "recruit":
        ({ data: userData, error } = await supabaseAdmin
          .from("recruit.users")
          .select("*")
          .eq("id", id)
          .single());
        break;
      case "volunteer":
        ({ data: userData, error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", id)
          .single());
        break;
      case "admin":
        ({ data: userData, error } = await supabaseAdmin
          .from("admin.users")
          .select("*")
          .eq("id", id)
          .single());
        break;
    }
    if (error) throw error;
    if (!userData) return { success: false, error: "User data not found" };
    switch (newRole) {
      case "recruit":
        ({ error } = await supabaseAdmin
          .from("recruit.users")
          .insert(userData));
        break;
      case "volunteer":
        ({ error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .insert(userData));
        break;
      case "admin":
        ({ error } = await supabaseAdmin.from("admin.users").insert(userData));
        break;
    }
    if (error) throw error;
    switch (userType.user_type) {
      case "recruit":
        ({ error } = await supabaseAdmin
          .from("recruit.users")
          .delete()
          .eq("id", id));
        break;
      case "volunteer":
        ({ error } = await supabaseAdmin
          .from("volunteer.recruiters")
          .delete()
          .eq("id", id));
        break;
      case "admin":
        ({ error } = await supabaseAdmin
          .from("admin.users")
          .delete()
          .eq("id", id));
        break;
    }
    if (error) throw error;
    ({ error } = await supabaseAdmin
      .from("user_types")
      .update({ user_type: newRole })
      .eq("user_id", id));
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error changing user role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function approveVolunteerRecruiter(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { error } = await supabaseAdmin
      .from("volunteer.recruiters")
      .update({
        is_active: true,
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error approving volunteer recruiter:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function rejectVolunteerRecruiter(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { error } = await supabaseAdmin
      .from("volunteer.recruiters")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    console.error("Error rejecting volunteer recruiter:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getPendingVolunteerRecruiters(): Promise<
  VolunteerUser[]
> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data, error } = await supabaseAdmin
      .from("volunteer.recruiters")
      .select("*")
      .eq("is_active", false)
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((volunteer: VolunteerUser) => ({
      ...volunteer,
      user_type: "volunteer",
      status: "pending",
    }));
  } catch (error) {
    console.error("Error getting pending volunteer recruiters:", error);
    return [];
  }
}

interface UserActivity {
  id: string;
  user_id: string;
  activity_type:
    | "login"
    | "profile_update"
    | "application_submit"
    | "badge_earn"
    | "challenge_complete";
  description: string;
  metadata?: Record<string, string | number | boolean>;
  created_at: string;
}

export async function getUserActivity(userId: string): Promise<UserActivity[]> {
  try {
    const supabaseAdmin = getServiceSupabase();
    const { data, error } = await supabaseAdmin
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching user activity:", error);
      return [];
    }

    return data as UserActivity[];
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    return [];
  }
}

// Repeat this pattern for all other server-only functions from user-management-service.ts
// (getUserStats, getUserById, updateUser, deleteUser, changeUserRole, approveVolunteerRecruiter, rejectVolunteerRecruiter, getPendingVolunteerRecruiters, getUserActivity)
