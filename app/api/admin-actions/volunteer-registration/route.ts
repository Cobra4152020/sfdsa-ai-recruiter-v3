import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { authConfig } from "@/lib/supabase-auth-config";
import { constructUrl } from "@/lib/url-utils";
import { sendVolunteerConfirmationEmail } from "@/lib/email/volunteer-emails";
import { getSystemSetting } from "@/lib/system-settings";
import crypto from "crypto";

interface VolunteerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  location: string;
  password: string;
  referralSource: string;
}

export async function registerVolunteerRecruiter(
  data: VolunteerRegistrationData,
) {
  try {
    const supabase = getServiceSupabase();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    // Create the user in Supabase Auth with email_confirm set to false
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: false, // Changed to false to require confirmation
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          organization: data.organization,
          position: data.position,
          location: data.location,
          referral_source: data.referralSource,
          is_volunteer_recruiter: true,
        },
        ...authConfig.getSignUpOptions(true),
      });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return { error: authError.message };
    }

    // Create user profile in the database
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: authUser.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        position: data.position,
        location: data.location,
        is_volunteer_recruiter: true,
        is_email_confirmed: false, // Track confirmation status
      });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return { error: profileError.message };
    }

    // Assign volunteer recruiter role (but mark as inactive until confirmed)
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authUser.user.id,
      role: "volunteer_recruiter",
      assigned_at: new Date().toISOString(),
      is_active: false, // Will be activated upon confirmation
    });

    if (roleError) {
      console.error("Error assigning role:", roleError);
      return { error: roleError.message };
    }

    // Create volunteer recruiter stats
    const { error: statsError } = await supabase
      .from("volunteer_recruiter_stats")
      .insert({
        user_id: authUser.user.id,
        referrals_count: 0,
        successful_referrals: 0,
        events_participated: 0,
        last_active: new Date().toISOString(),
      });

    if (statsError) {
      console.error("Error creating recruiter stats:", statsError);
      return { error: statsError.message };
    }

    // Generate confirmation token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store token in database
    const { error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .insert({
        email: data.email,
        token,
        type: "volunteer_confirmation",
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing confirmation token:", tokenError);
      return { error: "Failed to generate confirmation token" };
    }

    // Get admin notification email from system settings
    const adminEmail = await getSystemSetting(
      "NOTIFICATION_EMAIL",
      "notifications@sfdeputysheriff.com",
    );

    // Send confirmation email
    const confirmationUrl = `${constructUrl()}/volunteer-confirm?token=${token}`;
    const emailResult = await sendVolunteerConfirmationEmail(
      data.email,
      `${data.firstName} ${data.lastName}`,
      confirmationUrl,
    );

    if (!emailResult.success) {
      console.error("Error sending confirmation email:", emailResult.message);
      // Don't fail registration if email fails, but log it
    }

    // Send admin notification
    try {
      const { sendEmail } = await import("@/lib/email/send-email");
      await sendEmail({
        to: adminEmail,
        subject: "New Volunteer Recruiter Registration",
        html: `
          <h2>New Volunteer Recruiter Registration</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Organization:</strong> ${data.organization}</p>
          <p><strong>Position:</strong> ${data.position}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Referral Source:</strong> ${data.referralSource}</p>
          <p>The user will need to confirm their email before they can access the volunteer recruiter dashboard.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending admin notification:", emailError);
      // Don't fail registration if admin notification fails
    }

    // Revalidate paths

    return {
      success: true,
      userId: authUser.user.id,
      requiresConfirmation: true,
      emailSent: emailResult.success,
    };
  } catch (error) {
    console.error("Volunteer registration error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration",
    };
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await volunteerRegistration(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in volunteerRegistration:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
