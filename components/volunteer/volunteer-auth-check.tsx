"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client-singleton"

export function VolunteerAuthCheck({ children }: { children: React.ReactNode }) {
  const [isVolunteer, setIsVolunteer] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    async function checkVolunteerStatus() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          if (isMounted) {
            router.push("/volunteer-login")
          }
          return
        }

        // Check if user has volunteer_recruiter role
        const { data: userRoles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching user role:", error)
          if (isMounted) {
            router.push("/volunteer-login")
          }
          return
        }

        if (!userRoles || userRoles.role !== "volunteer_recruiter") {
          console.log("User does not have volunteer_recruiter role:", userRoles)
          if (isMounted) {
            router.push("/volunteer-login")
          }
          return
        }

        if (isMounted) {
          setIsVolunteer(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking volunteer status:", error)
        if (isMounted) {
          router.push("/volunteer-login")
        }
      }
    }

    checkVolunteerStatus()

    return () => {
      isMounted = false
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  return isVolunteer ? <>{children}</> : null
}
