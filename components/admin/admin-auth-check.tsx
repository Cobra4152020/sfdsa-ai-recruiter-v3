"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getClientSideSupabase } from "@/lib/supabase"
import { errorTracking } from "@/lib/error-tracking"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function checkAdminStatus() {
      try {
        const supabase = getClientSideSupabase()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error("Session error:", sessionError)
          errorTracking.trackError(sessionError, {
            location: "AdminAuthCheck",
            type: "session_error",
          })
          setError("Failed to get session")
          return
        }

        if (!session) {
          router.replace("/admin/login")
          return
        }

        // Check if user has admin role
        const { data: userRoles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()

        if (!mounted) return

        if (roleError) {
          console.error("Role check error:", roleError)
          errorTracking.trackError(roleError, {
            location: "AdminAuthCheck",
            type: "role_check_error",
            userId: session.user.id,
          })
          setError("Failed to check admin role")
          return
        }

        if (!userRoles || userRoles.role !== "admin") {
          router.replace("/admin/unauthorized")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Error checking admin status:", error)
        errorTracking.trackError(error as Error, {
          location: "AdminAuthCheck",
          type: "unexpected_error",
        })
        setError("An unexpected error occurred")
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkAdminStatus()

    return () => {
      mounted = false
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              errorTracking.trackAction("Admin auth retry clicked", {
                location: "AdminAuthCheck",
              })
              router.refresh()
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return isAdmin ? <>{children}</> : null
}
