export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { getServiceSupabase } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/url-utils";
import { authConfig } from "@/lib/supabase-auth-config";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Get Supabase settings
    const { data: settings, error } = await supabase
      .from("system_settings")
      .select("*")
      .in("key", ["SITE_URL", "AUTH_REDIRECT_URL"]);

    // Get environment variables
    const envConfig = {
      NODE_ENV: process.env.NODE_ENV || "unknown",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "not set",
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "not set",
      VERCEL_URL: process.env.VERCEL_URL || "not set",
    };

    // Get computed URLs
    const computedUrls = {
      baseUrl: getBaseUrl(),
      loginRedirect: authConfig.getRedirectUrl("login"),
      resetPasswordRedirect: authConfig.getRedirectUrl("resetPassword"),
      emailVerificationRedirect: authConfig.getRedirectUrl("emailVerification"),
      signUpRedirect: authConfig.getRedirectUrl("signUp"),
      volunteerSignUpRedirect: authConfig.getRedirectUrl("volunteerSignUp"),
      volunteerConfirmRedirect: authConfig.getRedirectUrl("volunteerConfirm"),
    };

    return NextResponse.json({
      success: true,
      databaseSettings: settings || [],
      environmentVariables: envConfig,
      computedUrls,
      error: error ? error.message : null,
    });
  } catch (error) {
    console.error("Error verifying URL configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify URL configuration" },
      { status: 500 },
    );
  }
}
