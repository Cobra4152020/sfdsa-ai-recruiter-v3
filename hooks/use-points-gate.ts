"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useApply } from "@/context/apply-context"

export function usePointsGate() {
  const [userPoints, setUserPoints] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { openApplyPopup } = useApply()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      if (session) {
        try {
          const { data, error } = await supabase
            .from("user_points_total_view")
            .select("total_points")
            .eq("user_id", session.user.id)
            .single()

          if (error) throw error
          setUserPoints(data?.total_points || 0)
        } catch (err) {
          console.error("Error fetching user points:", err)
          setUserPoints(0)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [supabase])

  const checkAccess = (requiredPoints: number, actionName: string, redirectUrl?: string) => {
    if (!isAuthenticated) {
      openApplyPopup({ requiredPoints, actionName, redirectUrl })
      return false
    }

    if (userPoints === null) return false

    return userPoints >= requiredPoints
  }

  return {
    userPoints,
    isLoading,
    isAuthenticated,
    checkAccess,
  }
}
