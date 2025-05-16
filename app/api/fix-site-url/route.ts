
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Get the current site URL configuration
    const { data: currentConfig, error: configError } = await supabaseAdmin
      .from("auth_config")
      .select("site_url")
      .single()

    if (configError) {
      return NextResponse.json({
        success: false,
        error: "Failed to get current site URL configuration",
        details: configError,
      })
    }

    // Update the site URL if needed
    const correctSiteUrl = "https://www.sfdeputysheriff.com"

    if (currentConfig?.site_url !== correctSiteUrl) {
      // Note: This is a simplified example. In reality, you would need to use
      // the Supabase Management API to update the site URL configuration.
      // This requires additional permissions and is not available through the
      // regular client API.

      return NextResponse.json({
        success: false,
        error: "Cannot automatically update site URL through this API",
        message: "Please update the site URL manually in the Supabase dashboard",
        currentUrl: currentConfig?.site_url,
        correctUrl: correctSiteUrl,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Site URL is already correctly configured",
      siteUrl: currentConfig?.site_url,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while checking the site URL configuration",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
