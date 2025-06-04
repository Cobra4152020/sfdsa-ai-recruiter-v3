import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendVolunteerConfirmationEmail } from "@/lib/email/volunteer-emails";
import { constructUrl } from "@/lib/url-utils";
import { diagnoseUserAuth } from "@/lib/auth-diagnostic";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // Use the diagnostic tool to check user status across systems
    const diagnostic = await diagnoseUserAuth(email);

    // If user doesn't exist in either system, return error
    if (!diagnostic.authUserExists && !diagnostic.userProfileExists) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email address",
        },
        { status: 404 },
      );
    }

    // If user exists in auth but not in user_profiles, create the profile
    if (
      diagnostic.authUserExists &&
      !diagnostic.userProfileExists &&
      diagnostic.authUserId
    ) {
      // Get user details from auth.users
      const { data: authUser } = await supabase
        .from("auth.users")
        .select("email, raw_user_meta_data")
        .eq("id", diagnostic.authUserId)
        .single();

      if (authUser && authUser.raw_user_meta_data) {
        const metadata = authUser.raw_user_meta_data as unknown;

        // Create user profile
        await supabase.from("user_profiles").insert({
          user_id: diagnostic.authUserId,
          email: authUser.email,
          first_name: metadata.first_name || metadata.firstName || "",
          last_name: metadata.last_name || metadata.lastName || "",
          is_volunteer_recruiter: metadata.is_volunteer_recruiter === true,
          is_email_confirmed: false,
        });

        // Also create user role if they're a volunteer recruiter
        if (metadata.is_volunteer_recruiter === true) {
          await supabase.from("user_roles").insert({
            user_id: diagnostic.authUserId,
            role: "volunteer_recruiter",
            assigned_at: new Date().toISOString(),
            is_active: false,
          });
        }
      }
    }

    // Get the latest user profile data
    const { data: user } = await supabase
      .from("user_profiles")
      .select(
        "user_id, first_name, last_name, is_email_confirmed, is_volunteer_recruiter",
      )
      .eq("email", email)
      .single();

    // If still no user profile or not a volunteer recruiter, return error
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No volunteer recruiter account found with this email address",
        },
        { status: 404 },
      );
    }

    if (!user.is_volunteer_recruiter) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is not registered as a volunteer recruiter",
        },
        { status: 400 },
      );
    }

    if (user.is_email_confirmed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email has already been confirmed. You can log in to your account.",
        },
        { status: 400 },
      );
    }

    // Check for existing tokens and invalidate them
    await supabase
      .from("email_confirmation_tokens")
      .update({ expires_at: new Date().toISOString() })
      .eq("email", email)
      .eq("type", "volunteer_recruiter")
      .is("used_at", null);

    // Generate new confirmation token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store token in database
    const { error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .insert({
        email,
        token,
        type: "volunteer_recruiter",
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing confirmation token:", tokenError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate confirmation token",
        },
        { status: 500 },
      );
    }

    // Send confirmation email
    const confirmationUrl = `${constructUrl()}/volunteer-confirm?token=${token}`;
    const name = `${user.first_name} ${user.last_name}`;
    const emailResult = await sendVolunteerConfirmationEmail(
      email,
      name,
      confirmationUrl,
    );

    if (!emailResult.success) {
      console.error("Error sending confirmation email:", emailResult.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send confirmation email. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A new confirmation email has been sent. Please check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
