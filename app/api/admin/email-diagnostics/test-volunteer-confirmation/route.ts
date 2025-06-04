export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendVolunteerConfirmationEmail } from "@/lib/email/volunteer-emails";
import { constructUrl } from "@/lib/url-utils";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email address is required",
      });
    }

    // Generate a test confirmation token
    const supabase = getServiceSupabase();
    const confirmationToken = `test_token_${Date.now()}`;

    // Store the token in Supabase for testing
    const { error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .insert({
        email,
        token: confirmationToken,
        type: "volunteer_confirmation",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      });

    if (tokenError) {
      return NextResponse.json({
        success: false,
        message: "Failed to generate confirmation token",
        details: {
          error: tokenError.message,
        },
      });
    }

    // Send the confirmation email
    const confirmationUrl = `${constructUrl()}/volunteer-confirm?token=${confirmationToken}`;
    const result = await sendVolunteerConfirmationEmail(
      email,
      "Test User",
      confirmationUrl,
    );

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to send volunteer confirmation email",
        details: result,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer confirmation email sent successfully",
      details: {
        emailId: result.data?.id,
        recipient: email,
        confirmationUrl,
      },
    });
  } catch (error) {
    console.error("Volunteer confirmation test error:", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error sending confirmation email",
    });
  }
}
