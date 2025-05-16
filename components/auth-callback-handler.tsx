"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-clients"
import { supabaseAdmin } from "@/lib/supabase-service"
import { addParticipationPoints } from "@/lib/points-service"

// Add type assertion to handle Next.js route types
const asRoute = (path: string) => path as any

export function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get("code")
      const userType = searchParams.get("userType") || "recruit"
      const callbackUrl = searchParams.get("callbackUrl")

      // Redirect URL based on user type
      let redirectTo = "/"
      if (userType === "volunteer") {
        redirectTo = "/volunteer-dashboard"
      } else if (userType === "admin") {
        redirectTo = "/admin/dashboard"
      } else {
        redirectTo = "/dashboard"
      }

      // Use callback URL if provided
      if (callbackUrl) {
        redirectTo = callbackUrl
      }

      try {
        if (!code) {
          const url = new URL(redirectTo, window.location.origin)
          url.searchParams.set("error", "missing_code")
          router.replace(asRoute(url.toString()))
          return
        }

        // Create a supabase client with the provided code
        const supabase = createClient()

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error || !data.user) {
          console.error("Error exchanging code for session:", error)
          const url = new URL(redirectTo, window.location.origin)
          url.searchParams.set("error", "auth_error")
          router.replace(asRoute(url.toString()))
          return
        }

        // Check if user exists in our database
        const { data: userTypeData } = await supabaseAdmin
          .from("user_types")
          .select("user_type")
          .eq("user_id", data.user.id)
          .maybeSingle()

        const isNewUser = !userTypeData

        if (isNewUser) {
          // Create new user profile for social login
          const { id, email, user_metadata } = data.user

          if (!email) {
            const url = new URL(redirectTo, window.location.origin)
            url.searchParams.set("error", "missing_email")
            router.replace(asRoute(url.toString()))
            return
          }

          // Extract name from metadata
          const name = user_metadata?.name || user_metadata?.full_name || email.split("@")[0]
          const avatarUrl = user_metadata?.avatar_url || user_metadata?.picture

          // Create user in recruit.users table
          await supabaseAdmin.from("recruit.users").insert({
            id,
            email,
            name,
            avatar_url: avatarUrl,
            points: 50, // Initial points
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          // Set user type
          await supabaseAdmin.from("user_types").insert({
            user_id: id,
            user_type: "recruit",
            email,
          })

          // Log the initial points
          await supabaseAdmin.from("user_point_logs").insert([
            {
              user_id: id,
              points: 50,
              action: "Initial signup bonus via social login",
              created_at: new Date().toISOString(),
            },
          ])

          // Award initial points
          await addParticipationPoints(id, 50, "sign_up", "Initial signup bonus via social login")
        }

        // If user is a volunteer, check if active
        if (userType === "volunteer" && !isNewUser) {
          const { data: volunteerData } = await supabaseAdmin
            .from("volunteer.recruiters")
            .select("is_active")
            .eq("id", data.user.id)
            .single()

          if (!volunteerData?.is_active) {
            router.replace(asRoute("/volunteer-pending"))
            return
          }
        }

        // Redirect to the appropriate page
        if (isNewUser) {
          const url = new URL(redirectTo, window.location.origin)
          url.searchParams.set("newUser", "true")
          router.replace(asRoute(url.toString()))
        } else {
          router.replace(asRoute(redirectTo))
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        const url = new URL(redirectTo, window.location.origin)
        url.searchParams.set("error", "unexpected")
        router.replace(asRoute(url.toString()))
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return null
} 