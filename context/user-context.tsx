"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  setCurrentUser: (user: User | null) => void
  login: (user: User) => void
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  setCurrentUser: () => {},
  login: () => {},
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

  const login = (user: User) => {
    setCurrentUser(user)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Import dynamically to avoid issues during SSR
        const { supabase } = await import("@/lib/supabase-client-singleton")

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("Error fetching session:", sessionError)
          setError("Failed to authenticate")
          setIsLoading(false)
          return
        }

        if (!session) {
          setCurrentUser(null)
          setIsLoading(false)
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
          setError("Failed to load user profile")
          setIsLoading(false)
          return
        }

        const userType = userTypeData?.user_type || "recruit"

        // Set user data
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          avatarUrl: session.user.user_metadata?.avatar_url,
          userType,
        })
      } catch (error) {
        console.warn("Error in user context:", error)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, isLoading, error, setCurrentUser, login }}>{children}</UserContext.Provider>
  )
}
