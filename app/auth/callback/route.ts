import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const requestParams = requestUrl.searchParams;
  const code = requestParams.get("code");
  const userType = requestParams.get("userType") || "recruit";
  const callbackUrl = requestParams.get("callbackUrl");
  const error = requestParams.get("error");
  const errorDescription = requestParams.get("error_description");

  // If there's an error from Supabase OAuth
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || "")}`,
        requestUrl.origin,
      ),
    );
  }

  // Determine redirect URL based on user type
  let redirectTo = "/";
  if (userType === "volunteer") {
    redirectTo = "/volunteer-dashboard";
  } else if (userType === "admin") {
    redirectTo = "/admin/dashboard";
  } else {
    redirectTo = "/dashboard";
  }

  // Use callback URL if provided
  if (callbackUrl) {
    // Validate the callback URL is from our domain
    try {
      const callbackUrlObj = new URL(callbackUrl);
      if (callbackUrlObj.origin === requestUrl.origin) {
        redirectTo = callbackUrl;
      }
    } catch {
      console.error("Invalid callback URL:", callbackUrl);
    }
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Get user info
    const { data: userDataResult, error: userError } =
      await supabase.auth.getUser();
    const user = userDataResult?.user;
    if (!user || userError) {
      console.error(
        "No user found after exchanging code for session.",
        userError,
      );
      return NextResponse.redirect(new URL("/login", requestUrl.origin));
    }

    // Get service client for admin operations
    const serviceClient = getServiceSupabase();

    // Get user type from user_types table
    const { data: userTypeData, error: userTypeError } = await serviceClient
      .from("user_types")
      .select("user_type")
      .eq("user_id", user.id)
      .single();

    if (userTypeError) {
      console.error("Error fetching user type:", userTypeError);
    }

    // Get user profile data based on user type
    let profileError;

    if (userTypeData?.user_type === "volunteer") {
      const { error } = await serviceClient
        .from("volunteer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      profileError = error;
    } else if (userTypeData?.user_type === "admin") {
      const { error } = await serviceClient
        .from("admin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      profileError = error;
    } else {
      const { error } = await serviceClient
        .from("recruit_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      profileError = error;
    }

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    // Redirect to the appropriate page
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  }

  // If no code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
