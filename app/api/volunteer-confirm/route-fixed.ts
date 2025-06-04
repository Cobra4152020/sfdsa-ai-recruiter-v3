import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { diagnoseUserAuth } from "@/lib/auth-diagnostic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const isTest = searchParams.get("test") === "true";

    // For test requests, just return a success response
    if (isTest) {
      return NextResponse.json({
        success: true,
        message: "Test endpoint is working",
      });
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No confirmation token provided",
        },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // Find the token in the database
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .select("*")
      .eq("token", token)
      .eq("type", "volunteer_recruiter")
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired confirmation token",
        },
        { status: 400 },
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Confirmation token has expired. Please register again.",
        },
        { status: 400 },
      );
    }

    // Check if token is already used
    if (tokenData.used_at) {
      return NextResponse.json(
        {
          success: false,
          message: "This email has already been confirmed",
        },
        { status: 400 },
      );
    }

    // Mark token as used
    await supabase
      .from("email_confirmation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenData.id);

    // Use diagnostic tool to get user information
    const diagnostic = await diagnoseUserAuth(tokenData.email);

    if (!diagnostic.authUserExists && !diagnostic.userProfileExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please register again.",
        },
        { status: 400 },
      );
    }

    // Update user profile to mark email as confirmed
    if (diagnostic.userProfileExists && diagnostic.userProfileId) {
      await supabase
        .from("user_profiles")
        .update({ is_email_confirmed: true })
        .eq("user_id", diagnostic.userProfileId);
    }

    // Activate the volunteer recruiter role
    if (diagnostic.userProfileId) {
      // Check if role exists
      const { data: roleExists } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", diagnostic.userProfileId)
        .eq("role", "volunteer_recruiter")
        .single();

      if (roleExists) {
        // Update existing role
        await supabase
          .from("user_roles")
          .update({ is_active: true })
          .eq("user_id", diagnostic.userProfileId)
          .eq("role", "volunteer_recruiter");
      } else {
        // Create new role
        await supabase.from("user_roles").insert({
          user_id: diagnostic.userProfileId,
          role: "volunteer_recruiter",
          assigned_at: new Date().toISOString(),
          is_active: true,
        });
      }
    }

    // Update Supabase Auth user to confirm email
    if (diagnostic.authUserExists && diagnostic.authUserId) {
      await supabase.auth.admin.updateUserById(diagnostic.authUserId, {
        email_confirm: true,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Your email has been confirmed successfully. You can now log in to your volunteer recruiter account.",
      email: tokenData.email,
    });
  } catch (error) {
    console.error("Error confirming volunteer email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while confirming your email",
      },
      { status: 500 },
    );
  }
}
