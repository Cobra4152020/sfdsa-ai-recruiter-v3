export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        message: "Resend API key is not configured",
      });
    }

    // We don't actually send an email here to avoid unnecessary API calls
    // Just check if the API key is present and well-formed
    if (resendApiKey.startsWith("re_") && resendApiKey.length > 10) {
      return NextResponse.json({
        success: true,
        message: "Email service is configured correctly",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Resend API key appears to be invalid",
      });
    }
  } catch (error) {
    console.error("Email health check error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error checking email service",
      },
      { status: 500 },
    );
  }
}
