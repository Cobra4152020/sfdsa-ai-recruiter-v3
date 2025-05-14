"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { useRegistration } from "@/context/registration-context"
import { useRouter } from "next/navigation"

export function useAuth(
  options: {
    requiredUserType?: "recruit" | "volunteer" | "admin"
    redirectTo?: string
    redirectIfFound?: boolean
  } = {},
) {
  const { currentUser, isLoggedIn } = useUser()
  const { openRegistrationPopup } = useRegistration()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short circuit if auth is still loading
    if (typeof window === "undefined") return

    // Initialization logic
    const init = async () => {
      try {
        const { supabase } = await import("@/lib/supabase-client-singleton")
        const { data } = await supabase.auth.getSession()

        // If no session and redirect not set to "ifFound", redirect to login
        if (!data.session && options.redirectTo && !options.redirectIfFound) {
          router.push(options.redirectTo)
          return
        }

        // If session exists and redirectIfFound is true, redirect
        if (data.session && options.redirectIfFound && options.redirectTo) {
          router.push(options.redirectTo)
          return
        }

        // Check user type if required
        if (options.requiredUserType && currentUser) {
          const { data: userData } = await supabase
            .from("user_types")
            .select("user_type")
            .eq("user_id", currentUser.id)
            .single()

          if (userData?.user_type !== options.requiredUserType) {
            // Redirect to unauthorized page
            router.push("/unauthorized")
            return
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [currentUser, router, options])

  const login = (userType = "recruit", callbackUrl?: string) => {
    openRegistrationPopup({
      userType: userType as "recruit" | "volunteer" | "admin",
      initialTab: "signin",
      callbackUrl,
    })
  }

  const register = (userType = "recruit", callbackUrl?: string) => {
    openRegistrationPopup({
      userType: userType as "recruit" | "volunteer" | "admin",
      initialTab: "signup",
      callbackUrl,
    })
  }

  const signOut = async () => {
    try {
      const { supabase } = await import("@/lib/supabase-client-singleton")
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return {
    user: currentUser,
    isLoggedIn,
    isLoading,
    login,
    register,
    signOut,
  }
}
