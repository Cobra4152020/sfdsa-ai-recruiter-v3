import { getServiceSupabase } from "@/app/lib/supabase/server";

export interface UserDiagnosticResult {
  email: string;
  authUserExists: boolean;
  authUserId?: string;
  userProfileExists: boolean;
  userProfileId?: string;
  isVolunteerRecruiter?: boolean;
  isEmailConfirmed?: boolean;
  hasUserRole?: boolean;
  roleActive?: boolean;
  hasConfirmationToken?: boolean;
  tokenExpired?: boolean;
  tokenUsed?: boolean;
  discrepancies: string[];
}

export async function diagnoseUserAuth(
  email: string,
): Promise<UserDiagnosticResult> {
  const supabase = getServiceSupabase();
  const result: UserDiagnosticResult = {
    email,
    authUserExists: false,
    userProfileExists: false,
    discrepancies: [],
  };

  try {
    // Check auth.users table
    const { data: authUser } = await supabase
      .from("auth.users")
      .select("id, email_confirmed_at")
      .eq("email", email)
      .single();

    result.authUserExists = !!authUser;
    if (authUser) {
      result.authUserId = authUser.id;
    }

    // Check user_profiles table
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("user_id, is_volunteer_recruiter, is_email_confirmed")
      .eq("email", email)
      .single();

    result.userProfileExists = !!userProfile;
    if (userProfile) {
      result.userProfileId = userProfile.user_id;
      result.isVolunteerRecruiter = userProfile.is_volunteer_recruiter;
      result.isEmailConfirmed = userProfile.is_email_confirmed;
    }

    // Check user_roles table
    if (result.userProfileId) {
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role, is_active")
        .eq("user_id", result.userProfileId)
        .eq("role", "volunteer_recruiter")
        .single();

      result.hasUserRole = !!userRole;
      if (userRole) {
        result.roleActive = userRole.is_active;
      }
    }

    // Check email_confirmation_tokens table
    const { data: tokens } = await supabase
      .from("email_confirmation_tokens")
      .select("token, expires_at, used_at")
      .eq("email", email)
      .eq("type", "volunteer_recruiter")
      .order("created_at", { ascending: false })
      .limit(1);

    result.hasConfirmationToken = tokens && tokens.length > 0;
    if (result.hasConfirmationToken && tokens[0]) {
      result.tokenExpired = new Date(tokens[0].expires_at) < new Date();
      result.tokenUsed = !!tokens[0].used_at;
    }

    // Identify discrepancies
    if (result.authUserExists && !result.userProfileExists) {
      result.discrepancies.push(
        "User exists in auth.users but not in user_profiles",
      );
    }

    if (!result.authUserExists && result.userProfileExists) {
      result.discrepancies.push(
        "User exists in user_profiles but not in auth.users",
      );
    }

    if (
      result.authUserExists &&
      result.userProfileExists &&
      result.authUserId !== result.userProfileId
    ) {
      result.discrepancies.push(
        "User ID mismatch between auth.users and user_profiles",
      );
    }

    if (
      result.userProfileExists &&
      result.isVolunteerRecruiter &&
      !result.hasUserRole
    ) {
      result.discrepancies.push(
        "User marked as volunteer recruiter but has no role assignment",
      );
    }

    if (
      result.userProfileExists &&
      !result.isVolunteerRecruiter &&
      result.hasUserRole
    ) {
      result.discrepancies.push(
        "User has volunteer recruiter role but not marked as such in profile",
      );
    }

    if (
      authUser &&
      userProfile &&
      !!authUser.email_confirmed_at !== !!userProfile.is_email_confirmed
    ) {
      result.discrepancies.push(
        "Email confirmation status mismatch between auth.users and user_profiles",
      );
    }

    return result;
  } catch (error) {
    console.error("Error diagnosing user auth:", error);
    result.discrepancies.push(
      `Error during diagnosis: ${error instanceof Error ? error.message : String(error)}`,
    );
    return result;
  }
}
