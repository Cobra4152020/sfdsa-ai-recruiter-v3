import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { addParticipationPoints } from "@/lib/points-service";

export async function POST(request: Request) {
  try {
    const { code, userType, callbackUrl } = await request.json();
    let redirectTo = "/";
    if (userType === "volunteer") {
      redirectTo = "/volunteer-dashboard";
    } else if (userType === "admin") {
      redirectTo = "/admin/dashboard";
    } else {
      redirectTo = "/dashboard";
    }
    if (callbackUrl) {
      redirectTo = callbackUrl;
    }
    if (!code) {
      const url = new URL(
        redirectTo,
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      );
      url.searchParams.set("error", "missing_code");
      return NextResponse.json({ redirectTo: url.toString() });
    }
    const supabase = getServiceSupabase();
    // Exchange code for session (this may need to be adapted for your Supabase setup)
    // You may need to use supabase.auth.exchangeCodeForSession if available on the server
    // For now, just check if user exists
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      const url = new URL(
        redirectTo,
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      );
      url.searchParams.set("error", "auth_error");
      return NextResponse.json({ redirectTo: url.toString() });
    }
    const user = userData.user;
    // Check if user exists in our database
    const { data: userTypeData } = await supabase
      .from("user_types")
      .select("user_type")
      .eq("user_id", user.id)
      .maybeSingle();
    const isNewUser = !userTypeData;
    if (isNewUser) {
      // Create new user profile for social login
      const { id, email, user_metadata } = user;
      if (!email) {
        const url = new URL(
          redirectTo,
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        );
        url.searchParams.set("error", "missing_email");
        return NextResponse.json({ redirectTo: url.toString() });
      }
      const name =
        user_metadata?.name || user_metadata?.full_name || email.split("@")[0];
      const avatarUrl = user_metadata?.avatar_url || user_metadata?.picture;
      await supabase.from("recruit.users").insert({
        id,
        email,
        name,
        avatar_url: avatarUrl,
        points: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await supabase.from("user_types").insert({
        user_id: id,
        user_type: "recruit",
        email,
      });
      await addParticipationPoints(
        id,
        50,
        "sign_up",
        "Initial signup bonus via social login",
      );
    }
    // If user is a volunteer, check if active
    if (userType === "volunteer" && !isNewUser) {
      const { data: volunteerData } = await supabase
        .from("volunteer.recruiters")
        .select("is_active")
        .eq("id", user.id)
        .single();
      if (!volunteerData?.is_active) {
        return NextResponse.json({ redirectTo: "/volunteer-pending" });
      }
    }
    // Redirect to the appropriate page
    if (isNewUser) {
      const url = new URL(
        redirectTo,
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      );
      url.searchParams.set("newUser", "true");
      return NextResponse.json({ redirectTo: url.toString() });
    } else {
      return NextResponse.json({ redirectTo });
    }
  } catch (error) {
    console.error("Auth callback API error:", error);
    return NextResponse.json(
      {
        redirectTo: "/",
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
