"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the user type
interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  userType?: string
  participation_count?: number
  has_applied?: boolean
}

// Define the context type
interface UserContextType {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  isLoggedIn: boolean
  setCurrentUser: (user: User | null) => void
  login: (user: User) => void
  signOut: () => Promise<void>
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  isLoggedIn: false,
  setCurrentUser: () => {},
  login: () => {},
  signOut: async () => {},
})

// Hook to use the user context
export const useUser = () => useContext(UserContext)

// Add the missing export as an alias to maintain backward compatibility
export const useUserContext = useUser

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Only initialize supabase on the client
  const [supabase, setSupabase] = useState<any>(null)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically require getClientSideSupabase only on the client
      const { getClientSideSupabase } = require("@/lib/supabase")
      setSupabase(getClientSideSupabase())
    }
  }, [])

  const login = (user: User) => {
    setCurrentUser(user)
  }

  const signOut = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      setCurrentUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    if (!supabase) return
    let mounted = true

    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("Error fetching session:", sessionError)
          if (mounted) {
            setError("Failed to authenticate")
            setIsLoading(false)
          }
          return
        }

        if (!session) {
          if (mounted) {
            setCurrentUser(null)
            setIsLoading(false)
          }
          return
        }

        // Get user profile based on user type
        const { data: userTypeData, error: userTypeError } = await supabase
          .from("user_types")
          .select("user_type")
          .eq("user_id", session.user.id)
          .maybeSingle()

        if (userTypeError) {
          console.warn("Error fetching user type:", userTypeError)
          if (mounted) {
            setError("Failed to load user profile")
            setIsLoading(false)
          }
          return
        }

        const userType = userTypeData?.user_type || "recruit"

        if (mounted) {
          // Set user data
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            avatarUrl: session.user.user_metadata?.avatar_url,
            userType,
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.warn("Error in user context:", error)
        if (mounted) {
          setError("An unexpected error occurred")
          setIsLoading(false)
        }
      }
    }

    fetchUser()

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false
    }
  }, [supabase])

  return (
    <UserContext.Provider value={{ currentUser, isLoading, error, isLoggedIn: !!currentUser, setCurrentUser, login, signOut }}>
      {children}
    </UserContext.Provider>
  )
}
