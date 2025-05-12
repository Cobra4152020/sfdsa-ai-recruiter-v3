"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"

interface User {
  id: string
  name: string
  email?: string
  participation_count?: number
  has_applied?: boolean
  first_name?: string
  last_name?: string
}

interface UserContextType {
  currentUser: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  incrementParticipation: (points: number) => Promise<boolean>
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  incrementParticipation: async () => false,
  setCurrentUser: () => {},
})

export const useUser = () => useContext(UserContext)
export const useUserContext = () => useContext(UserContext)

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
          const { data: userData, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          if (!error && userData) {
            setCurrentUser({
              id: userData.user_id,
              name: userData.first_name + " " + userData.last_name,
              email: userData.email,
              participation_count: userData.points,
              has_applied: userData.application_status !== "new",
              first_name: userData.first_name,
              last_name: userData.last_name,
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

  const incrementParticipation = async (points: number) => {
    if (!currentUser?.id) return false
    try {
      const { error } = await supabase
        .from("users")
        .update({ participation_count: currentUser.participation_count + points })
        .eq("id", currentUser.id)
      if (error) throw error
      setCurrentUser((prev) => ({ ...prev, participation_count: (prev?.participation_count || 0) + points }))
      return true
    } catch (error) {
      console.error("Error incrementing participation:", error)
      return false
    }
  }

  const contextValue = {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    logout,
    incrementParticipation,
    setCurrentUser,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const UserContextProvider = UserProvider
