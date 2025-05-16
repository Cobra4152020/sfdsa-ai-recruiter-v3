import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { constructUrl } from "@/lib/url-utils"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const steps = []
    let overallSuccess = true

    // Step 1: Check Supabase Auth configuration
    try {
      const { data: authSettings } = await supabase.auth.getSettings()

      const redirectUrls = authSettings?.redirectUrls || []
      const siteUrl = constructUrl()
      const hasCorrectRedirectUrl = redirectUrls.some((url) => url.includes(new URL(siteUrl).hostname))

      steps.push({
        name: "Supabase Auth Configuration",
        success: hasCorrectRedirectUrl,
        message: hasCorrectRedirectUrl
          ? "Supabase Auth has correct redirect URLs configured"
          : "Supabase Auth is missing the correct redirect URL",
        details: {
          redirectUrls,
          siteUrl,
        },
      })

      if (!hasCorrectRedirectUrl) overallSuccess = false
    } catch (error) {
      steps.push({
        name: "Supabase Auth Configuration",
        success: false,
        message: "Failed to check Supabase Auth configuration",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
      overallSuccess = false
    }

    // Step 2: Check volunteer role configuration
    try {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "volunteer_recruiter")
        .limit(1)

      const volunteerRoleExists = !rolesError && roles && roles.length > 0

      steps.push({
        name: "Volunteer Role Configuration",
        success: volunteerRoleExists,
        message: volunteerRoleExists
          ? "Volunteer recruiter role is properly configured"
          : "Volunteer recruiter role is not configured in the database",
      })

      if (!volunteerRoleExists) overallSuccess = false
    } catch (error) {
      steps.push({
        name: "Volunteer Role Configuration",
        success: false,
        message: "Failed to check volunteer role configuration",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
      overallSuccess = false
    }

    // Step 3: Check email confirmation table
    try {
      const { data, error } = await supabase.from("email_confirmation_tokens").select("id").limit(1)

      const tableExists = !error

      steps.push({
        name: "Email Confirmation Table",
        success: tableExists,
        message: tableExists ? "Email confirmation tokens table exists" : "Email confirmation tokens table is missing",
        details: error ? { error: error.message } : undefined,
      })

      if (!tableExists) overallSuccess = false
    } catch (error) {
      steps.push({
        name: "Email Confirmation Table",
        success: false,
        message: "Failed to check email confirmation table",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
      overallSuccess = false
    }

    // Step 4: Check volunteer confirmation endpoint
    try {
      const testResponse = await fetch(`${constructUrl()}/api/volunteer-confirm?test=true`, {
        method: "GET",
      })

      const endpointExists = testResponse.status !== 404

      steps.push({
        name: "Volunteer Confirmation Endpoint",
        success: endpointExists,
        message: endpointExists
          ? "Volunteer confirmation endpoint exists"
          : "Volunteer confirmation endpoint is missing",
        details: {
          status: testResponse.status,
          url: `${constructUrl()}/api/volunteer-confirm`,
        },
      })

      if (!endpointExists) overallSuccess = false
    } catch (error) {
      steps.push({
        name: "Volunteer Confirmation Endpoint",
        success: false,
        message: "Failed to check volunteer confirmation endpoint",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
      overallSuccess = false
    }

    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess
        ? "Auth flow appears to be configured correctly"
        : "Issues detected in the auth flow configuration",
      steps,
    })
  } catch (error) {
    console.error("Auth flow test error:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error testing auth flow",
      steps: [
        {
          name: "Overall Test",
          success: false,
          message: "Test failed with an unexpected error",
          details: { error: error instanceof Error ? error.message : "Unknown error" },
        },
      ],
    })
  }
}
