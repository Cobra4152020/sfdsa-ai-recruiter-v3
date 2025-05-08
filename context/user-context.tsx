"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"

interface User {
  id: string
  name: string
  email?: string
  participation_count?: number
  has_applied?: boolean
}

interface UserContextType {
  currentUser: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile data
          const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (!error && userData) {
            setCurrentUser({
              id: userData.id,
              name: userData.name || "User",
              email: userData.email,
              participation_count: userData.participation_count,
              has_applied: userData.has_applied,
            })
          } else {
            // For demo purposes, create a mock user
            setCurrentUser({
              id: "demo-user-id",
              name: "Demo User",
              participation_count: 1500,
              has_applied: false,
            })
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }

    checkSession()
  }, [])

  const login = (user: User) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
    supabase.auth.signOut().catch(console.error)
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
